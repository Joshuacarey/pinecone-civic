import React from 'react'
import ReactDOM from 'react-dom'

import Add from '@material-ui/icons/Add'
import Cloud from '@material-ui/icons/CloudDownloadOutlined'
import FilterList from '@material-ui/icons/FilterList'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import Search from '@material-ui/icons/Search'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core'
/**
 * @typedef {import('@material-ui/core').Theme} Theme
 * @typedef {import('@material-ui/core/TextField').BaseTextFieldProps} BaseTextFieldProps
 */
/**
 * @template K
 * @typedef {import('@material-ui/core/styles').StyleRules<K>} StyleRules
 */

import StatusFilterMenu from '../StatusFilterMenu'
/**
 * @typedef {import('../StatusFilterMenu').Props} StatusFilterMenuProps
 */

/**
 * @typedef {object} Props
 * @prop {StyleRules<keyof ReturnType<typeof styles>>} classes
 * @prop {React.Ref<SVGSVGElement>} filterIconRef
 * @prop {StatusFilterMenuProps['anchorEl']} filterMenuAnchorEl (Refer to
 * `<StatusFilterMenu />`'s props).
 * @prop {StatusFilterMenuProps['currentStatusValue']} filterMenuCurrentStatusValue
 * (Refer to `<StatusFilterMenu />`'s props).
 * @prop {StatusFilterMenuProps['open']} filterMenuOpen (Refer to
 * `<StatusFilterMenu />`'s props).
 * @prop {number} numberOfRecords
 * @prop {Function=} onClickAdd Called when the user clicks on the plus icon.
 * @prop {Function=} onClickDownload Called when the user clicks on the download
 * icon.
 * @prop {Function=} onClickFilterButton Consumer should create a dom ref to
 * pass into filter , to which the menu will 'attach'.
 * @prop {Function=} onClickSearch Called when the user clicks on the search
 * icon, ideally this should change state above and pass true to the
 * `showSearch` prop as a result.
 * @prop {BaseTextFieldProps['onChange']} onChangeSearchValue Called when the
 * value inside the search text (if it's currently on display) input changes.
 * @prop {StatusFilterMenuProps['onClose']} onCloseFilterMenu (Refer to
 * `<StatusFilterMenu />`'s props).
 * @prop {StatusFilterMenuProps['onStatusChange']} onFilterMenuStatusChange
 * (Refer to `<StatusFilterMenu />`'s props).
 * @prop {StatusFilterMenuProps['possibleStatuses']} possibleStatuses (Refer to
 * `<StatusFilterMenu />`'s props).
 * @prop {boolean|null|undefined} showSearch Determines whether the text input
 * for search should be on display.
 */

export {} // stop jsdoc comments from merging

/**
 * You shouldn't probably be importing this component but instead any consumier
 * container, as you'll be managing more state than needed (such as keeping
 * track of opening and closing the pop-over filter menu). Please refer to that
 * container's documentation to know what is offered from this
 * component/container combo.
 * This component receives the underlying filter menu component's props directly
 * as an optimization technique.
 * @augments React.PureComponent<Props>
 */
class ListToolbar extends React.PureComponent {
  render() {
    const {
      classes,
      filterIconRef,
      filterMenuAnchorEl,
      filterMenuCurrentStatusValue,
      filterMenuOpen,
      numberOfRecords,
      onChangeSearchValue,
      onClickAdd,
      onClickDownload,
      onClickFilterButton,
      onClickSearch,
      onCloseFilterMenu,
      onFilterMenuStatusChange,
      possibleStatuses,
      showSearch,
    } = this.props

    return (
      <div className={classes.root}>
        {showSearch && (
          <div>
            <TextField
              className={classes.textField}
              type="search"
              margin="dense"
              variant="outlined"
              fullWidth
              placeholder="Search Groups"
              InputProps={{
                startAdornment: (
                  <InputAdornment className={classes.inputAdornment}>
                    <Search className={classes.searchIcon} />
                  </InputAdornment>
                ),
              }}
              onChange={onChangeSearchValue}
            />
          </div>
        )}

        <div className={classes.filters}>
          <IconButton className={classes.icons}>
            <Add onClick={onClickAdd} />
          </IconButton>
          <IconButton className={classes.icons}>
            <Cloud onClick={onClickDownload} />
          </IconButton>
          <IconButton className={classes.icons}>
            <Search onClick={onClickSearch} />
          </IconButton>
          <IconButton className={classes.icons}>
            <FilterList ref={filterIconRef} onClick={onClickFilterButton} />
          </IconButton>
        </div>
        <StatusFilterMenu
          anchorEl={ReactDOM.findDOMNode(filterMenuAnchorEl)}
          currentStatusValue={filterMenuCurrentStatusValue}
          onClose={onCloseFilterMenu}
          onStatusChange={onFilterMenuStatusChange}
          open={filterMenuOpen}
          possibleStatuses={possibleStatuses}
        />
        <div className={classes.records}>{numberOfRecords} records</div>
      </div>
    )
  }
}

/**
 * @param {Theme} theme
 */
const styles = theme => ({
  filters: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  inputAdornment: {
    position: 'start',
  },
  records: {
    paddingTop: 0,
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 10,
    },
  },
  root: {
    padding: '0 15px 15px 25px',
    [theme.breakpoints.up('sm')]: {
      padding: '15px 15px 15px 25px',
    },
  },
  searchIcon: {
    color: 'bdbdbd',
  },
  textField: {
    backgroundColor: '#F9F9F9',
    color: 'white',
  },
})

export default withStyles(styles)(ListToolbar)