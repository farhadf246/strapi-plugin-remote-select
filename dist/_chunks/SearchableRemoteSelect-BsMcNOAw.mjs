import { jsx, jsxs } from "react/jsx-runtime";
import { ComboboxOption, Flex, Checkbox, Tag, Field, Combobox } from "@strapi/design-system";
import { Cross } from "@strapi/icons";
import { debounce } from "lodash-es";
import { useId, useState, useMemo, useCallback, useEffect } from "react";
import { useIntl } from "react-intl";
function SearchableRemoteSelect(attrs) {
  const { name, error, hint, onChange, value, label, attribute, required } = attrs;
  const selectConfiguration = attribute.options;
  const generatedId = useId();
  const { formatMessage } = useIntl();
  const [options, setOptions] = useState([]);
  const [loadingError, setLoadingError] = useState(void 0);
  const [isLoading, setIsLoading] = useState(false);
  const isMulti = useMemo(
    () => !!selectConfiguration.select?.multi,
    [selectConfiguration]
  );
  const valueParsed = useMemo(() => {
    if (isMulti) {
      if (!value || value === "null") {
        return [];
      }
      try {
        const parseResult = JSON.parse(value);
        return Array.isArray(parseResult) ? parseResult : [parseResult];
      } catch (err) {
        return [];
      }
    } else {
      if (!value) {
        return void 0;
      }
      try {
        const parseResult = JSON.parse(value);
        const option = Array.isArray(parseResult) ? parseResult[0] : parseResult;
        return !Object.keys(option).length ? void 0 : option;
      } catch (err) {
        return void 0;
      }
    }
  }, [value]);
  const [searchModel, setSearchModel] = useState(
    valueParsed && isSingleParsed() ? valueParsed.label : ""
  );
  const loadOptionsDebounced = useCallback(
    debounce((value2) => {
      setIsLoading(true);
      loadOptions(value2);
    }, 500),
    []
  );
  useEffect(() => {
    loadOptionsDebounced(valueParsed && isSingleParsed() ? valueParsed.label : "");
  }, []);
  async function loadOptions(searchModel2) {
    try {
      const config = { ...selectConfiguration.fetch };
      config.url = (config.url || "").replace("{q}", searchModel2);
      const res = await fetch(window.location.origin + "/remote-select/options-proxy", {
        method: "POST",
        body: JSON.stringify({
          fetch: {
            ...selectConfiguration.fetch,
            url: selectConfiguration.fetch.url.replace("{q}", searchModel2),
            body: selectConfiguration.fetch.body && selectConfiguration.fetch.body.replace("{q}", searchModel2)
          },
          mapping: selectConfiguration.mapping
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (res.status === 200) {
        setOptions(await res.json());
      } else {
        setLoadingError(res.statusText + ", code:  " + res.status);
      }
    } catch (err) {
      setLoadingError(err?.message || err?.toString());
    } finally {
      setIsLoading(false);
    }
  }
  function handleChange(stringValueProjection) {
    if (!stringValueProjection) {
      if (!isMulti) {
        writeSingleModel(void 0);
      }
      return;
    }
    try {
      const value2 = JSON.parse(stringValueProjection);
      if (isMulti) {
        if (!isInModel(value2)) {
          writeMultiModel([...valueParsed, value2]);
        } else {
          removeFromModel(value2);
        }
        handleTextValueChange("");
      } else {
        writeSingleModel(value2);
      }
    } catch (err) {
    }
  }
  function handleTextValueChange(val) {
    setSearchModel(val);
    if (valueParsed && isSingleParsed() && valueParsed.label !== val) {
      handleChange(void 0);
    }
    loadOptionsDebounced(val);
  }
  function handleOpenChange() {
    if (isMulti) {
      setSearchModel("");
    }
  }
  function isSingleParsed(val) {
    return !isMulti;
  }
  function isMultiParsed(val) {
    return isMulti;
  }
  function isInModel(option) {
    return !!valueParsed && isMultiParsed() && valueParsed.some((o) => o.value === option.value);
  }
  function removeFromModel(option) {
    if (!!valueParsed && isMultiParsed()) {
      writeMultiModel(valueParsed.filter((o) => o.value !== option.value));
    }
  }
  function writeMultiModel(value2) {
    onChange({
      target: {
        name,
        type: attribute.type,
        value: value2 && value2.length ? JSON.stringify(value2) : required ? void 0 : JSON.stringify([])
      }
    });
  }
  function writeSingleModel(value2) {
    onChange({
      target: {
        name,
        type: attribute.type,
        value: value2 ? JSON.stringify(value2) : required ? void 0 : JSON.stringify({})
      }
    });
  }
  function clear(event) {
    event.stopPropagation();
    event.preventDefault();
    if (!isMulti) {
      writeSingleModel(void 0);
    }
  }
  const optionsList = options.map((opt) => {
    const optionString = JSON.stringify(opt);
    return /* @__PURE__ */ jsx(ComboboxOption, { value: optionString, children: /* @__PURE__ */ jsxs(Flex, { wrap: "wrap", gap: 2, children: [
      isMulti ? /* @__PURE__ */ jsx(Checkbox, { checked: isInModel(opt) }) : void 0,
      opt.label
    ] }) }, opt.value);
  });
  const selectedValuesTags = valueParsed && isMultiParsed() ? /* @__PURE__ */ jsx("div", { style: { marginTop: ".5rem" }, children: /* @__PURE__ */ jsx(Flex, { wrap: "wrap", gap: 1, children: valueParsed.map((option) => /* @__PURE__ */ jsx(
    Tag,
    {
      type: "button",
      icon: /* @__PURE__ */ jsx(Cross, { "aria-hidden": true }),
      onClick: () => removeFromModel(option),
      children: option.label
    },
    option.value
  )) }) }) : void 0;
  return /* @__PURE__ */ jsxs(Field.Root, { hint, error, id: generatedId, required, children: [
    /* @__PURE__ */ jsx(Field.Label, { children: label }),
    /* @__PURE__ */ jsxs(
      Combobox,
      {
        name,
        value,
        onChange: handleChange,
        allowCustomValue: true,
        autocomplete: "none",
        id: generatedId,
        error,
        loading: isLoading,
        placeholder: formatMessage({
          id: "remote-select.searchable-select.placeholder",
          defaultMessage: "Search a new values"
        }),
        loadingMessage: formatMessage({
          id: "remote-select.select.loading-message",
          defaultMessage: "Loading..."
        }),
        noOptionsMessage: () => formatMessage({
          id: "remote-select.searchable-select.no-results",
          defaultMessage: "No results for your query"
        }),
        onTextValueChange: handleTextValueChange,
        onOpenChange: handleOpenChange,
        textValue: searchModel,
        onClear: isMulti ? void 0 : clear,
        children: [
          loadingError && `Options loading error: ${loadingError}. Please check the field configuration.`,
          optionsList
        ]
      }
    ),
    /* @__PURE__ */ jsx(Field.Hint, {}),
    /* @__PURE__ */ jsx(Field.Error, {}),
    selectedValuesTags
  ] });
}
export {
  SearchableRemoteSelect as default
};
