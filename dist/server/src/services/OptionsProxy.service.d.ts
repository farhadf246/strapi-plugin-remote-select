import { Core } from '@strapi/strapi';
import type { FlexibleSelectMappingConfig } from '../../../types/FlexibleSelectConfig';
import type { RemoteSelectFetchOptions } from '../../../types/RemoteSelectFetchOptions';
import { SearchableRemoteSelectValue } from '../../../types/SearchableRemoteSelectValue';
export declare const OptionsProxyService: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    /**
     * Fetches options based on a provided configuration object, processes the response,
     * and maps the data into the desired format.
     *
     * @param  config - The configuration object containing fetch details,
     * including URL, method, headers, body, and mapping instructions for processing the response.
     * @return  A promise that resolves to the processed options extracted and mapped from the response.
     */
    getOptionsByConfig(config: RemoteSelectFetchOptions): Promise<SearchableRemoteSelectValue[]>;
    /**
     * Parses a string of headers into an object where each key is a header name and each value is the corresponding header value.
     *
     * @param [headers] - A string representing the headers, where each header is separated by a newline and the key-value pairs are separated by a colon.
     * @return An object containing the parsed headers where the keys are the header names in lowercase, and the values are the corresponding header values.
     */
    parseStringHeaders(headers?: string): Record<string, string>;
    /**
     * Removes leading and trailing whitespace characters from a given string.
     *
     * @param {string} val - The string to be trimmed.
     * @return {string} The trimmed string without leading or trailing whitespace.
     */
    trim(val: string): string;
    /**
     * Parses options from the provided response using the given mapping configuration.
     *
     * @param {any} response - The JSON response to parse and extract options from.
     * @param  mappingConfig - The configuration defining the paths for extracting values and labels.
     * @return {SearchableRemoteSelectValue[]} An array of unique options with `value` and `label` properties.
     */
    parseOptions(response: any, mappingConfig: FlexibleSelectMappingConfig): SearchableRemoteSelectValue[];
    /**
     * Retrieves the value of a specific item from a JSON object based on a given JSON path.
     * If the item is not a string, it is converted to a string representation using JSON.stringify.
     *
     * @param {any} rawOption - The JSON object from which to extract the item.
     * @param {string} jsonPath - The JSON path to locate the item. Defaults to "$" (root object).
     *
     * @return {string} The value of the item as a string.
     */
    getOptionItem(rawOption: any, jsonPath?: string): string;
    /**
     * Replaces variables in a given string with corresponding values from the configuration.
     * Variables in the input string are denoted by `{variableName}`.
     *
     * @param {string} str - The input string containing variables to be replaced.
     * @return {string} The string with variables replaced by their corresponding values.
     * If a variable does not exist in the configuration, it remains unchanged.
     */
    replaceVariables(str: string): string;
};
export default OptionsProxyService;
