Single select

```jsx
import Autocomplete from 'apollo-react/components/Autocomplete';

const countries = [
  { label: 'Afghanistan' },
  { label: 'Aland Islands' },
  { label: 'Albania' },
  { label: 'Algeria' },
  { label: 'American Samoa' },
  { label: 'Andorra' },
  { label: 'Angola' },
  { label: 'Anguilla' },
  { label: 'Antarctica' },
  { label: 'Antigua and Barbuda' },
  { label: 'Argentina' },
  { label: 'Armenia' },
  { label: 'Aruba' },
  { label: 'Australia' },
  { label: 'Austria' },
  { label: 'Azerbaijan' },
  { label: 'Bahamas' },
  { label: 'Bahrain' },
  { label: 'Bangladesh' },
  { label: 'Barbados' },
  { label: 'Belarus' },
  { label: 'Belgium' },
  { label: 'Belize' },
  { label: 'Benin' },
  { label: 'Bermuda' },
  { label: 'Bhutan' },
  { label: 'Bolivia, Plurinational State of' },
  { label: 'Bonaire, Sint Eustatius and Saba' },
  { label: 'Bosnia and Herzegovina' },
  { label: 'Botswana' },
  { label: 'Bouvet Island' },
  { label: 'Brazil' },
  { label: 'British Indian Ocean Territory' },
  { label: 'Brunei Darussalam' },
];

const [value, setValue] = React.useState(null);

const handleChange = (event, newValue) => {
  setValue(newValue);
};

<div style={{ maxWidth: 400 }}>
  <Autocomplete
    label="Label"
    placeholder="Optional hint text…"
    helperText="Optional help text"
    source={countries}
    fullWidth
    value={value}
    onChange={handleChange}
  />
</div>;
```

Multiple select

```jsx
import Autocomplete from 'apollo-react/components/Autocomplete';

import countries from './countries.data';

const [value, setValue] = React.useState([]);

const handleChange = (event, newValue) => {
  setValue(newValue);
};

<div style={{ maxWidth: 400 }}>
  <Autocomplete
    label="Label"
    placeholder="Optional hint text…"
    helperText="Optional help text"
    source={countries}
    fullWidth
    multiple
    value={value}
    onChange={handleChange}
  />
</div>;
```
<!-- 
• no dropdown arrow ✓
• placeholder text says “Type to search” ✓
• don’t show the menu when you click or focus the field ✓
• show the menu after the user types
• customizable number of characters
• mock fetching the data. see Lazy Loading Table for an example. 
-->
Lazy loading example

```jsx
import Autocomplete from 'apollo-react/components/Autocomplete';

import countries from './countries.data';

const [value, setValue] = React.useState([]);

const handleChange = (event, newValue) => {
  setValue(newValue);
};

<div style={{ maxWidth: 400 }}>
  <Autocomplete
    label="Label"
    placeholder="Type to search…"
    helperText="Type to search"
    source={countries}
    fullWidth
    multiple
    value={value}
    onChange={handleChange}
    forcePopupIcon={false}
  />
</div>;
```