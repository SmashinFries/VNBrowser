import * as Burnt from 'burnt';

export const sendToast = (message: string, duration: number = 3) =>
    Burnt.toast({ title: message, duration: duration });
