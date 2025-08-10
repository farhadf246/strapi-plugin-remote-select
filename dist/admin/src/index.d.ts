import { StrapiApp } from '@strapi/strapi/admin';
declare const _default: {
    register(app: StrapiApp): void;
    registerTrads(app: any): Promise<({
        data: string;
        locale: string;
    } | {
        data: {};
        locale: string;
    })[]>;
};
export default _default;
