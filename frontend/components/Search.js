import { resetIdCounter, useCombobox } from 'downshift';
import { useLazyQuery } from '@apollo/client';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';
import getImageUrl from '../lib/getImageUrl';
import { SEARCH_PRODUCTS_QUERY } from '../lib/queries';

export default function Search() {
  const router = useRouter();
  const [findItems, { loading, data, error }] = useLazyQuery(
    SEARCH_PRODUCTS_QUERY,
    { fetchPolicy: 'no-cache' }
  );
  const items = data?.searchTerms || [];
  const findItemsDebounced = debounce(findItems, 350);
  resetIdCounter();
  const {
    isOpen,
    inputValue,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items,
    onInputValueChange() {
      findItemsDebounced({ variables: { searchTerm: inputValue } });
    },
    onSelectedItemChange({ selectedItem }) {
      router.push({ pathname: `/product/${selectedItem.id}` });
    },
    itemToString: (item) => item?.name || '',
  });

  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: 'search',
            placeholder: 'Search for an Item',
            id: 'search',
            className: loading ? 'loading' : '',
          })}
        />
      </div>
      <DropDown {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <Link key={item.id} href={`/product/${item.id}`}>
              <DropDownItem
                {...getItemProps({ item })}
                highlighted={index === highlightedIndex}
              >
                <img src={getImageUrl(item)} alt={item.name} width="50" />
                {item.name}
              </DropDownItem>
            </Link>
          ))}
        {inputValue && isOpen && !items.length && !loading && (
          <DropDownItem>Sorry, No items found for '{inputValue}'</DropDownItem>
        )}
      </DropDown>
    </SearchStyles>
  );
}
