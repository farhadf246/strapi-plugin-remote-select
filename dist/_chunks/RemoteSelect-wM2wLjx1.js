"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const designSystem = require("@strapi/design-system");
const react = require("react");
const reactIntl = require("react-intl");
function RemoteSelect({
  value,
  onChange,
  name,
  label,
  required,
  attribute,
  hint,
  placeholder,
  disabled,
  error
}) {
  const defaultPlaceholder = {
    id: "remote-select.select.placeholder",
    defaultMessage: "Select a value"
  };
  const selectConfiguration = attribute.options;
  const { formatMessage } = reactIntl.useIntl();
  const isMulti = react.useMemo(
    () => !!selectConfiguration.select?.multi,
    [selectConfiguration]
  );
  const [isLoading, setIsLoading] = react.useState(true);
  const [options, setOptions] = react.useState([]);
  const [optionsLoadingError, setLoadingError] = react.useState();
  const valueParsed = react.useMemo(() => {
    if (isMulti) {
      if (!value) {
        return [];
      }
      try {
        return JSON.parse(value);
      } catch (err) {
        return [value];
      }
    }
    return value;
  }, [value]);
  react.useEffect(() => {
    loadOptions();
  }, []);
  async function loadOptions() {
    setIsLoading(true);
    try {
      const res = await fetch("/remote-select/options-proxy", {
        method: "POST",
        body: JSON.stringify({
          fetch: selectConfiguration.fetch,
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
  function handleChange(value2) {
    if (isMulti) {
      value2 = Array.isArray(value2) ? value2 : [];
      value2 = value2.filter((el) => el !== void 0 && el !== null);
      value2 = value2.length ? JSON.stringify(value2) : void 0;
    }
    onChange({
      target: { name, type: attribute.type, value: value2 }
    });
  }
  function clear(event) {
    event.stopPropagation();
    event.preventDefault();
    handleChange(void 0);
  }
  const optionsList = options.map((opt) => {
    return isMulti ? /* @__PURE__ */ jsxRuntime.jsx(designSystem.MultiSelectOption, { value: opt.value, children: opt.label }, opt.value) : /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: opt.value, children: opt.label }, opt.value);
  });
  const SelectToRender = isMulti ? designSystem.MultiSelect : designSystem.SingleSelect;
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { name, hint, required, error, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: label }),
    /* @__PURE__ */ jsxRuntime.jsxs(
      SelectToRender,
      {
        withTags: isMulti,
        placeholder: placeholder || formatMessage(defaultPlaceholder),
        "aria-label": label,
        name,
        onChange: handleChange,
        value: valueParsed,
        disabled,
        error,
        required,
        onClear: clear,
        loading: isLoading ?? true,
        children: [
          optionsLoadingError && `Options loading error: ${optionsLoadingError}. Please check the field configuration`,
          optionsList
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {}),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, {})
  ] });
}
exports.default = RemoteSelect;
