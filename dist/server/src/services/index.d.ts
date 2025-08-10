declare const _default: {
    OptionsProxyService: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        getOptionsByConfig(config: import("../../../types/RemoteSelectFetchOptions").RemoteSelectFetchOptions): Promise<import("../../../types/SearchableRemoteSelectValue").SearchableRemoteSelectValue[]>;
        parseStringHeaders(headers?: string): Record<string, string>;
        trim(val: string): string;
        parseOptions(response: any, mappingConfig: import("../../../types/FlexibleSelectConfig").FlexibleSelectMappingConfig): import("../../../types/SearchableRemoteSelectValue").SearchableRemoteSelectValue[];
        getOptionItem(rawOption: any, jsonPath?: string): string;
        replaceVariables(str: string): string;
    };
};
export default _default;
