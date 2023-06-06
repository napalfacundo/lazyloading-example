import MuiAutocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { createGenerateClassName, StylesProvider } from '@mui/styles';
import makeStyles from '@mui/styles/makeStyles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { VariableSizeList } from 'react-window';

import ArrowDownIcon from '../../icons/ArrowDown';
import CloseCircleIcon from '../../icons/CloseCircle';
import withRef from '../../utils/withRef';
import Chip from '../Chip';
import InputLabel from '../InputLabel';
import Tooltip from '../Tooltip';
import Typography from '../Typography';
import FakePopper from './FakePopper';
import InlineMenuContainer from './InlineMenuContainer';
import Option from './Option';
import styles from './styles';

const generateClassName = createGenerateClassName({
  seed: 'a',
});

export const defaultAddLabelFunc = (inputValue) => `Add "${inputValue}"`;

export const filterOptions = (
  selectAllText,
  matchForm = 'start',
  limit,
  allowAddNewOptions,
  addLabelFunc = defaultAddLabelFunc,
  value
) => (options, params) => {
  const filterCallBack = createFilterOptions({
    matchForm,
    limit,
    stringify: (option) => (option.label === selectAllText ? '' : option.label),
  });

  const filtered = filterCallback(options, params);

  if (
    allowAddNewOptions &&
    params.inputValue &&
    !options.some(({ label }) => label.toLowerCase() === params.inputValue.toLowerCase()) &&
    (!Array.isArray(value) ||
      !value.some(({ label }) => label.toLowerCase() === params.inputValue.toLowerCase()))
      ) {
        filtered.push({
          label: addLabelFunc(params.inputValue),
          __RAW_VALUE__: params.inputValue,
        });
      }
    return filtered.length ? filtered : [{ noMatches: true }];
};

export const renderTags = (
  chipColor,
  size,
  allSelected,
  handleClearAll,
  allChipText,
  limitChips,
  alwaysLimitChips,
  toggleOpen,
  classes,
  disabled
) =>
  function renderTagsFunc(tagValue, getTagProps) {
    if(allSelected) {
      return (
        <>
        <Chip 
          onClick={toggleOpen}
          label={allChipText}
          color={chipColor}
          onDelete={handleClearAll}
          size={size}
          disabled={disabled}
          />
          {tagValue.map(
            (option, index) =>
            option.custom && (
              <Chip
              key={index}
              onClick={toggleOpen}
              label={options.label}
              {...getTagProps({ index })}
              color={chipColor}
              size={size}
              />
            )
          )}
        </>
      );
    } else {
      let chips = tagValue.map((option, index) => {
        const chip = (
          <Chip
            key={index}
            onClick={toggleOpen}
            label={options.selectedLabel || option.label}
            {...getTagProps({ index })}
            color={chipColor}
            size={size}
            disabled={disabled}
            />
        );
        return limitChips > -1 && alwaysLimitChips ? (
          <Tooltip title={options.label} key={index}>
            {chip}
          </Tooltip>
        ) : (
          chip
        );
      });

      if (limitChips > -1 && alwaysLimitChips) {
        const more = chips.length - limitChips;
        if (more > 0) {
          chips = chips.splice(0, limitChips);
          chips.push(
            <span className={classes.moreIndiciator} key={chips.length}>
              {`+${more}`}
            </span>
          );
        }
      }

      return <div className={classes.chipWrapper}>{chips}</div>
    }

    return chips;
  };

export const getOptionLabel = (option) => option.selectedLabel || option.label || '';

export const isOptionEqualToValue = (option, value) =>
  option.value ? option.value === value.value : option.label === value.label;

export const renderOption = (
  showCheckboxes,
  allSelected,
  matchFrom,
  noWrap,
  selectAllText,
  getOptionTooltip,
  TooltipProps,
  noOptionText,
  inlineMenu,
  multiple,
  value
) =>
  function renderOptionFunc(listItemProps, option, { inputValue, selected }) {
    const optProps = {
      showCheckboxes,
      allSelected,
      matchFrom,
      option,
      inputValue,
      selected,
      noWrap,
      listItemProps,
      isSelectAllOption: option.label === selectAllText,
      tooltipText: getOptionTooltip(option),
      TooltipProps,
      noOptionText,
      inlineMenu,
      shouldHishglight: multiple || value?.label !== inputValue,
    }
    return <Option {...optProps} key={listItemProps.key} />;
  };
const LISTBOX_PADDING = 8; //px

const OuterElementContext = React.createContext({});

const Row = ({ data, index, style }) => (
  <div
    key={data[index].key}
    style ={{
      ...style,
      top: style.top + LISTBOX_PADDING,
    }}
    >
      {data[index]}
    </div>
);

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

OuterElementType.displayName = 'OuterElementType';

function userResetCache(data) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponentBase = ({ childre, size, forwardRef: ref, ...other }) => {
  const itemData = React.Children.toArray(children);
  const itemCount = itemData.length;
  const itemSize = size === 'small' ? 32 : 40;

  const getHeight = () => {
    if (itemCount > 10) {
      return 10 * itemSize;
    }
    return itemData.map(() => itemSize).reduce((a, b) => a + b, 0);
  }

  const gridRef = userResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
        itemData={itemData}
        height={getHeight}
        width="100%"
        OuterElementType={OuterElementType}
        itemSize={() => itemSize}
        overScanCount={itemCount}
        ref={gridRef}>
          {(props) => <Row {...props} />}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
};

const ListboxComponent = withRef()(ListboxComponentBase);

const useStyles = makeStyles(styles);

export const Autocomplete = ({
  label,
  source,
  helperText,
  disabled,
  error, 
  className,
  placeholder,
  onChange,
  limitChips = -1,
  value,
  inputValue,
  fullWidth,
  onInputChange,
  required,
  asteriskPosition,
  optional,
  multiple = false,
  chipColor = 'white',
  size = 'medium',
  showClearAll = false,
  showCheckboxes = multiple,
  showSelectAll = false,
  showClearIndicator = !multiple,
  selectAllText = 'Clear all',
  clearAllText = 'Clear all',
  allChipText= 'All',
  noOptionsText = 'No options',
  blurOnSelect = !multiple,
  clearOnBlur = true,
  disableClearable = false,
  disableCloseOnSelect = multiple,
  forcePopupIcon = true, 
  alwaysLimitChips = false,
  matchFrom = 'start',
  limit,
  enableVirtualization, 
  TextFieldProps,
  inlineMenu, 
  iconControlsMenu, 
  ListboxProps,
  maxMenuHeight,
  onOpen,
  onClose,
  open,
  forwardedRef,
  disableBackspaceRemoveSelected,
  noWrap,
  allowAddNewOptions,
  TooltipProps,
  getOptionDisabled = (option) => option.disabled,
  getOptionTooltip = (option) => option.tooltipText,
  addLabelFunc = defaultAddLabelFunc,
  maxItems = 10,
  filterSelectedOptions = true,
  ...rest
}) => {
  const classes = useStyles();
  const ref = React.useRef();
  const [isOpenState, setIsOpenState] = React.useState(false);

  const isOpen = open ?? isOpenState;
  const handleOpen = (e) => {
    if (onOpen) {
      onOpen(e);
    }
    setIsOpenState(true);
  };
  constHandleClose = (e, reason) => {
    if (onClose) {
      onClose(e, reason);
    }
    setIsOpenState(false)
  };
  const toggleOpen = isOpen ? handleClose : handleOpen;

  const sourceMap = react.useMemo(() => {
    const map = new Map();

    if (!Array.isArray(source)) {
      return map;
    }

    sourve forEach((opt) => map.set(opt.label, opt));

    return map
  }, [source]);

  const [valueMap, extraValueMap] = React.useMemo(() => {
    const extra = new Map();
    const selected = new Map();

    if (!Array.isArray(value)) {
      return [extra, selected];
    }

    value.forEach((vale) => {
      if (sourceMap.has(val.label)) {
        selected.set(val.label, val);
      } else {
        extra.set(val.label, val);
      }
    });

    return [selected, extra];
  }, [value, sourceMap]);

  const handleClearAll = (e) => {
    onChange && onChange(e, [], 'clearAll');
  };

  return (
    <StylesProvider generateClassName={generateClassName}>
    <div className={classes.labelWrapper}>
      {label && (
        <InputLabel
          required={required}
          optional={optional}
          className={classes.label}
          asteriskPosition={asteriskPosition}
          >
            {label}
          </InputLabel>
      )}
      {showClearAll && (
        <Typography
        className={classNames(
          classes.clearAll,
          (value?.length === 0 || disabled) && classes.clearAllDisabled
        )}
        onClick={handleClearAll}
        >
          {clearAllText}
        </Typography>
      )}
    </div>
  <MuiAutoComplete
  classes ={{
    option: classNames(classes.option, size === 'small' && classes.optionSmall),
    paper: classes.paper,
    popper: ckasses.popper,
  }}
  className={classNames(
    classes.root,
    size ==='small' && classes.small,
    showClearIndicator &&
    !(chipColor === 'none' && !inputValue) &&
    classes.showClearIndicator,
    className
  )}
    disabled={disabled}
    option={showSelectAll ? [{ label: selectAllText }, ...source] : source}
    limitTags={alwaysLimitChips ? -1 : limitChips}
    filterSelectedOptions={filterSelectedOptions}
    blurOnSelect={blurOnSelect}
    size="small"
    value={value}
    inputValue={inputValue}
    fullWidth={fullWidth}
    forcePopupIcon={forcePopupIcon}
    selectOnFocus={false}
    popupIcon={<ArrowDownIcon fontSize="extraSmall" />}
    clearIcon={<CloserCircleIcon fontSize="extraSmall" />}
    onChange={(event, value, reason) => {
      if (
        !(
          (reason === 'clear' && multiple) ||
          (event.key === 'Backspace' && chipColor === 'none')
        )
      ) {
        const hasSelectAll = 
          multiple &&
          Array.isArray(value) &&
          value.some(({ label }) => label === selectAllText);

          if (multiple && showSelectAll && hasSelectAll) {
            if (!allSelected) {
              value = [...source, ...extraValueMap.value()];
            } else {
              value = [...extraValueMap.values()];
            }
          }

onChange && onChange(event, value, reason);
      }
    }}
    onInputChange={(event, newInputValue, reason) => {
      onInputChange && onInputChange(event, newInputValue, reason);
    }}
    getOptionLabel={getOptionLabel}
    filterOptions={filterOptions(
      selectAllText,
      matchFrom,
      limit,
      allowAddNewOptions,
      addLabelFunc,
      value
    )}
    isOptionEqualToValue={isOptionEqualToValue}
    multiple={multiple}
    disableClearable={disableClearable}
    clearOnBlur={clearOnBlur}
    disableCloseOnSelect={disableCloseOnSelect}
    noOptionsText={noOptionsText}
    ListboxComponent={enableVirtualization ? ListboxComponent : undefined}
    ListboxProps={{
      ...ListboxProps,
      ...Autocomplete(enableVirtualiztion && { size }),
      style: {
        maxHeight: maxMenuHeight || (size === 'small' ? 32 : 40) * maxItems -8,
        ...ListboxProps?.style,
      },
    }}
    renderTags={
      chipColor === 'none'
      ? () => {}
      : renderTags(
        chipColor,
        size,
        allSelected,
        (e) => onChange && onChange(e, [...extraValueMap.values()], 'remove-option'),
        allChipText,
        limitChips,
        alwaysLimitChips,
        toggleOpen,
        classes.
        disabled
      )
    }
    onOpen={iconControlsMenu ? undefined : handleOpen}
    onClose={iconControlsMenu ? undefined : handleClose}
    open={isOpen}
    freeSolo
    getOptionDisabled={getOptionDisabled}
    {...Autocomplete(inlineMenu && {
      PopperComponent: FakePopper,
      PaperComponent: InlineMenuContainer,
      disablePortal: true,
    })}
    {...(iconControlsMenu && { open: isOpen || !!inputValue })}
    {...rest}
    renderInput={(params) => (
      <div>
      <TextField
        variant="outlined"
        placeholde={placeholder}
        helperText={helperText}
        error={error}
        {...params}
        fullWidth={fullWidth}
        inputProps={{
          ...params.inputProps,
          style: { minWidth: ref?.current>getBoundingClientRect().width },
        }}
        {...(iconControlsMenu && {
          onClick: (event) => {
            const buttonParent = event.target.closest('button');
            if (
              buttonParent &&
              Array.from(cuttonParent.classList).includes('MuiAutocomplete-popupIndicator')
            ) {
              toggleOpen();
            }
          },
        })}
        {...TextFieldProps}
        onKeyDown={(event) => {
          if (multiple && disableBackspaceRemoveSelected && event.key === 'Backspace') {
            event.stopPropagation();
          }
          TextFieldProps?.onKeyDown && TextFieldProps.onKeyDown(event);
        }}
      />
      </div>
    )}
        renderOption={renderOption(
          showCheckboxes,
          allSelected,
          matchFrom,
          noWrap || enableVirtualization,
          selectAllText,
          getOptionTooltip,
          TooltipProps,
          noOptionsText,
          inlineMenu,
          multiple,
          value
        )}
        ref={forwardedRef}
  />
  </StylesProvider>
  );
};

Autocomplete.propTypes = {
  /**
   * Customize the label shown in the dropdown when adding custom options.
   * Only used when `allowAddNewOptions` is `true`.
   * 
   * @param {string} inputValue The curren value of the input field.
   */
  addLabelFunc: propTypes.func,
  /**
   * Override the text for 'All' `Chip`, displayed when all options are selected
   */
  allChipText: propTypes.node,
  /**
   * If `true`, a menu option is shown that enables adding custom values.
   */
  allowAddNewOptions: propTypes.bool,
 /**
   * If `true`, `limitChips` always limits the number of `Chip`s shown, even
   * when the field is focused
   */
  alwaysLimitChips: propTypes.bool,
  /**
   * position of the asterisk when `required` is `true`.
   */
  asteriskPosition: propTypes.oneOf(['before', 'after']),
  /**
   * control if the input should be blurred when an option is selected:
   * -- `false`: the input is not blurred
   * -- `true`: the input is always blurred
   * -- `touch`: the input is blurred after touch event
   * -- `mouse`:  the input is blurred after mouse event
   */
  blurOnSelect: propTypes.oneOf(['mouse', 'touch', true, false]),
  /**
   * The color of the `Chip`s. If none, the chips will be hidden
   */
  chipColor: PropTypes.oneOf(['primary', 'white', 'none']),
  /** Override the default text for the 'Clear all' button. */
  clearAllText: PropTypes.node,
  /**
   * If `true`, the input's text is cleared on blur if no value is selected.
   * Set to `true` if you want to help the user enter a new value.
   * Set to `false` if you want to help the user resume their search.
   */
  clearOnBlur: PropTypes.bool,
  /** The default input value. Use when the component is not controlled. */
  defaultValue: PropTypes.any,
  /** If `true`, the options already selected can not be deleted by pressing the backspace key. Only relevant when `multiple` is `true`. */
  disableBackspaceRemoveSelected: PropTypes.bool,
  /** If `true`, the input can't be cleared. */
  disableClearable: PropTypes.bool,
  /** If `true`, the popup won't close when a value is selected. */
  disableCloseOnSelect: PropTypes.bool,
  /** If `true`, the component is disabled. */
  disabled: PropTypes.bool,
  /** If `true`, the list of available options loads dynamically on scroll. */
  enableVirtualization: PropTypes.bool,
  /** If `true`, the component is displayed in an error state. */
  error: PropTypes.bool,
  /** If `true`, the selected options are hidden from the menu. */
  filterSelectedOptions: PropTypes.bool,
  /** Force the visibility display of the popup icon. */
  forcePopupIcon: PropTypes.oneOf(['auto', true, false]),
  /** If `true`, the component takes up the full width of its container. */
  fullWidth: PropTypes.bool,
  /**
   * Used to determine the disabled state for a given option.
   * Signature:
   * function(option: T) => boolean
   * option: The option to test.
   */
  getOptionDisabled: PropTypes.func,
  /**
   * Used to determine the tooltip text for a given option.
   *
   * Signature: `function(option: T) => string`
   *
   * @param {Object} option The option to test.
   */
  getOptionTooltip: PropTypes.func,
  /** The helper text content. */
  helperText: PropTypes.node,
  /**
   * If `true`, the menu will only be shown if there is `inputText` or if the
   * popup icon is clicked. Used with the `popupIcon` prop.
   */
  iconControlsMenu: PropTypes.bool,
  /**
   * If `true`, the menu will be shown directly below the field, rather than
   * in a popper.
   */
  inlineMenu: PropTypes.bool,
  /** The input value. */
  inputValue: PropTypes.string,
  /** The label content. */
  label: PropTypes.node,
  /** Limit the number of suggested options to be shown. */
  limit: PropTypes.number,
  /**
   * The maximum number of chips that are visible when not focused.
   * Set -1 to disable the limit.
   */
  limitChips: PropTypes.number,
  /** Props applied to the `Listbox` component. */
  ListboxProps: PropTypes.object,
  /** The matching strategy.
   *
   * `start`: exact match from the beginning of the text
   *
   * `any`: exact match anywhere within the text
   **/
  matchFrom: PropTypes.oneOf(['start', 'any']),
  /** Maximum number of menu items shown in the menu. */
  maxItems: PropTypes.number,
  /** The maximum height of the menu. */
  maxMenuHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** If `true`, `value` must be an array and the menu will support multiple selections. */
  multiple: PropTypes.bool,
  /** Text to display when there are no options. */
  noOptionsText: PropTypes.node,
  /** If `true`, text in the menu truncates with an overflow ellipsis. */
  noWrap: PropTypes.bool,
  /**
   * Callback fired when the value changes.
   *
   * @param {object} event The event source of the callback.
   * @param {T|T[]} value The new value of the component.
   * @param {string} reason One of `"createOption"`, `"selectOption"`, `"removeOption"`, `"blur"` or `"clear"`.
   */
  onChange: PropTypes.func,
  /**
   * Callback fired when the popup requests to be closed. Use in controlled mode (see `open`).
   *
   * @param event: The event source of the callback.
   * @param reason: Can be: `"toggleInput"`, `"escape"`, `"selectOption"`,`"removeOption"`, `"blur"`.
   */
  onClose: PropTypes.func,
  /**
   * Callback fired when the input value changes.
   *
   * @param {object} event The event source of the callback.
   * @param {string} value The new value of the text input.
   * @param {string} reason Can be: `"input"` (user input), `"reset"` (programmatic change), `"clear"`.
   */
  onInputChange: PropTypes.func,
  /**
   * Callback fired when the popup requests to be opened. Use in controlled mode (see `open`).
   *
   * @param event: The event source of the callback.
   */
  onOpen: PropTypes.func,
  /** Control the `popup` open state. */
  open: PropTypes.bool,
  /** If `true`, the label is displayed as optional. */
  optional: PropTypes.bool,
  /** The short hint displayed in the input before the user enters a value. */
  placeholder: PropTypes.string,
  /** The icon to display in place of the default popup icon. */
  popupIcon: PropTypes.node,
  /** If `true`, the label is displayed as required. */
  required: PropTypes.bool,
  /** Override the default text for the 'Select all' menu option. */
  selectAllText: PropTypes.string,
  /** If `true`, checkboxes are displayed in the menu. */
  showCheckboxes: PropTypes.bool,
  /** If `true`, a clear all button is displayed. */
  showClearAll: PropTypes.bool,
  /** If `true`, a clear indicator is displayed. */
  showClearIndicator: PropTypes.bool,
  /** If `true`, a select all option is displayed in the menu. */
  showSelectAll: PropTypes.bool,
  /** The size of the component. */
  size: PropTypes.oneOf(['small', 'medium']),
  /** Array of options. */
  source: PropTypes.arrayOf(
    PropTypes.shape({
      /** If `true`, this option was created by the user. */
      custom: PropTypes.bool,
      /** If `true`, the option is disabled. */
      disabled: PropTypes.bool,
      /** The text of the option. */
      label: PropTypes.string,
      /** The text displayed in the Chip, or the field, if different from label. */
      selectedLabel: PropTypes.string,
      /** The props applied to the Tooltip. Accepts all Tooltip's props. */
      TooltipProps: PropTypes.object,
      /** Add a custom tooltip to show when hovering over the option. */
      tooltipText: PropTypes.node,
      /** The value of the Chip, or the field, if different from label. */
      value: PropTypes.any,
    })
  ),
  /** Props applied to the `TextField` component. */
  TextFieldProps: PropTypes.object,
  /** The props applied to the Tooltip. Accepts all Tooltip's props. */
  TooltipProps: PropTypes.object,
  /**
   * The value of the autocomplete.
   * The value must have reference equality with the option in order to be selected.
   * You can customize the equality behavior with the isOptionEqualToValue prop.
   */
  value: PropTypes.any,
};

export default withRef()(Autocomplete);
