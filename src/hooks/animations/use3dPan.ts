import { rotateXYZ, transformWithOrigin } from '@/utils/math';
import { Gesture } from 'react-native-gesture-handler';
import { clamp, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type Use3dPanConfig = {
    xLimit: [number, number];
    yLimit: [number, number];
};

const animConfig: Use3dPanConfig = {
    xLimit: [-45, 45],
    yLimit: [-120, 120],
};

const use3dPan = (config = animConfig) => {
    const xRotation = useSharedValue(0);
    const yRotation = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            yRotation.value = clamp(e.translationX * 1, config.yLimit[0], config.yLimit[1]);
            xRotation.value = clamp(e.translationY * -1, config.xLimit[0], config.xLimit[1]);
        })
        .onEnd((e) => {
            yRotation.value = withTiming(0, { duration: 1000 });
            xRotation.value = withTiming(0, { duration: 1000 });
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { perspective: 500 },
            { rotateX: `${xRotation.value}deg` },
            { rotateY: `${yRotation.value}deg` },
        ],
    }));

    return { panGesture, animatedStyle };
};

export const use3dCube = (size: { width: number; height: number; depth: number }) => {
    const xFront = useSharedValue(0);
    const yFront = useSharedValue(0);
    const originCube = {
        x: 0,
        y: 0,
        z: size.height / 2,
    };

    const panGesture = Gesture.Pan().onUpdate((e) => {
        xFront.value = e.translationX / 50.0; // 50.0
        yFront.value = -e.translationY / 50.0; // 50.0
    });

    const animatedStyleFront = useAnimatedStyle(() => {
        const rotationMatrix = rotateXYZ(yFront.value, xFront.value, 0);
        transformWithOrigin(rotationMatrix, originCube);
        return {
            transform: [{ perspective: 1000 }, { matrix: rotationMatrix }],
        };
    });

    const animatedStyleLeft = useAnimatedStyle(() => {
        const rotationMatrix = rotateXYZ(
            yFront.value,
            xFront.value - Math.PI / 2.0, // -90 degree for the left surface of the cube
            0,
        );
        transformWithOrigin(rotationMatrix, originCube);
        return {
            transform: [{ perspective: 1000 }, { matrix: rotationMatrix }],
        };
    });

    const animatedStyleRight = useAnimatedStyle(() => {
        const rotationMatrix = rotateXYZ(
            yFront.value,
            xFront.value + Math.PI / 2.0, // +90 degree for the left surface of the cube
            0,
        );
        transformWithOrigin(rotationMatrix, originCube);
        return {
            transform: [{ perspective: 1000 }, { matrix: rotationMatrix }],
        };
    });

    const animatedStyleBack = useAnimatedStyle(() => {
        const rotationMatrix = rotateXYZ(
            yFront.value,
            xFront.value + Math.PI, // +180 degree for the back surface of the cube
            0,
        );
        transformWithOrigin(rotationMatrix, originCube);
        return {
            transform: [{ perspective: 1000 }, { matrix: rotationMatrix }],
        };
    });

    const animatedStyleTop = useAnimatedStyle(() => {
        const rotationMatrix = rotateXYZ(
            yFront.value + Math.PI / 2.0, // +90 degree for the top surface of the cube
            0,
            -xFront.value,
        );
        transformWithOrigin(rotationMatrix, originCube);
        return {
            transform: [{ perspective: 1000 }, { matrix: rotationMatrix }],
        };
    });

    const animatedStyleBottom = useAnimatedStyle(() => {
        const rotationMatrix = rotateXYZ(
            yFront.value - Math.PI / 2.0, // -90 degree for the top surface of the cube
            0,
            xFront.value,
        );
        transformWithOrigin(rotationMatrix, originCube);
        return {
            transform: [{ perspective: 1000 }, { matrix: rotationMatrix }],
        };
    });

    return {
        panGesture,
        animatedStyleFront,
        animatedStyleLeft,
        animatedStyleRight,
        animatedStyleBack,
        animatedStyleTop,
        animatedStyleBottom,
    };
};

export default use3dPan;
