declare const _default: {
    register: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    bootstrap: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    destroy: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    config: {
        default: import("../../types/RemoteSelectPluginOptions").RemoteSelectPluginOptions;
        validator(): void;
    };
    controllers: {
        FetchOptionsProxyController: ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            index(ctx: any): Promise<void>;
        };
    };
    routes: {
        method: string;
        path: string;
        handler: string;
        config: {
            policies: any[];
            auth: boolean;
        };
    }[];
    services: {
        OptionsProxyService: ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            getOptionsByConfig(config: import("../../types/RemoteSelectFetchOptions").RemoteSelectFetchOptions): Promise<import("../../types/SearchableRemoteSelectValue").SearchableRemoteSelectValue[]>;
            parseStringHeaders(headers?: string): Record<string, string>;
            trim(val: string): string;
            parseOptions(response: any, mappingConfig: import("../../types/FlexibleSelectConfig").FlexibleSelectMappingConfig): import("../../types/SearchableRemoteSelectValue").SearchableRemoteSelectValue[];
            getOptionItem(rawOption: any, jsonPath?: string): string;
            replaceVariables(str: string): string;
        };
    };
    contentTypes: {};
    policies: {};
    middlewares: {};
};
export default _default;
