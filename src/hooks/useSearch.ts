import { useCallback, useEffect, useMemo, useState } from 'react';
import _, { debounce, set } from 'lodash';
import { VNSortOptions, VNFilterState, VNFilterCharState } from '@/api/vndb/types';

export const useVNSearch = () => {
    const [sort, setSort] = useState<VNSortOptions>('votecount');
    const [reverse, setReverse] = useState<boolean>(true);
    const [filter, setFilters] = useState<VNFilterState>({});

    const onSortChange = (value: VNSortOptions) => {
        setSort(value);
    };

    const onReverseChange = (value: boolean) => {
        setReverse(value);
    };

    const updateFilter = (
        key: keyof VNFilterState,
        value: string | number | string | undefined,
    ) => {
        if (key === 'search' && value === '') {
            value = undefined;
        }
        setFilters((prev) => {
            const isArray = _.isArray(prev[key]);
            if (isArray) {
                const arr = prev[key] as any[];
                return {
                    ...prev,
                    [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
                };
            } else {
                return {
                    ...prev,
                    [key]: value,
                };
            }
        });
    };

    const updateTags = (id: number) => {
        setFilters((prev) => {
            const excluded_tags = prev.tag_not_in ?? [];
            const included_tags = prev.tag_in ?? [];
            if (included_tags?.includes(id)) {
                const newIncluded = included_tags.filter((tag) => tag !== id);
                return {
                    ...prev,
                    excluded_tags: [...excluded_tags, id],
                    included_tags: newIncluded.length > 0 ? newIncluded : undefined,
                };
            } else if (excluded_tags?.includes(id)) {
                const newExcluded = excluded_tags.filter((tag) => tag !== id);
                return { ...prev, excluded_tags: newExcluded.length > 0 ? newExcluded : undefined };
            } else {
                return { ...prev, included_tags: [...included_tags, id] };
            }
        });
    };

    const updateCharacterFilter = (
        index: number,
        key: keyof VNFilterCharState,
        value: string | number | undefined,
    ) => {
        setFilters((prev) => {
            const charFilters = prev.characters ?? [];
            const char = charFilters[index] ?? {};
            return {
                ...prev,
                character: [
                    ...charFilters.slice(0, index),
                    { ...char, [key]: value },
                    ...charFilters.slice(index + 1),
                ],
            };
        });
    };

    return {
        sort,
        reverse,
        filter,
        onSortChange,
        onReverseChange,
        updateFilter,
        updateCharacterFilter,
        updateTags,
    };
};
