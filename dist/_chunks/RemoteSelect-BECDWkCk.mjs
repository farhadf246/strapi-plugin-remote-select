import { jsx, jsxs } from "react/jsx-runtime";
import { MultiSelectOption, SingleSelectOption, Field, MultiSelect, SingleSelect } from "@strapi/design-system";
import { useMemo, useState, useEffect } from "react";
import { useIntl } from "react-intl";
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
  const { formatMessage } = useIntl();
  const isMulti = useMemo(
    () => !!selectConfiguration.select?.multi,
    [selectConfiguration]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const [optionsLoadingError, setLoadingError] = useState();
  const valueParsed = useMemo(() => {
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
  useEffect(() => {
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
    return isMulti ? /* @__PURE__ */ jsx(MultiSelectOption, { value: opt.value, children: opt.label }, opt.value) : /* @__PURE__ */ jsx(SingleSelectOption, { value: opt.value, children: opt.label }, opt.value);
  });
  const SelectToRender = isMulti ? MultiSelect : SingleSelect;
  return /* @__PURE__ */ jsxs(Field.Root, { name, hint, required, error, children: [
    /* @__PURE__ */ jsx(Field.Label, { children: label }),
    /* @__PURE__ */ jsxs(
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
    /* @__PURE__ */ jsx(Field.Error, {}),
    /* @__PURE__ */ jsx(Field.Hint, {})
  ] });
}
export {
  RemoteSelect as default
};
