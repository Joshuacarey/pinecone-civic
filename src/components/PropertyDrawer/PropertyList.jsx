import React, { Fragment } from 'react'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import HistoryIcon from '@material-ui/icons/History'

import {
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemSecondaryAction,
  ListSubheader,
  IconButton,
  withStyles,
} from '@material-ui/core'

import PropertyIcon from './PropertyIcon'

const styles = ({ custom: { smallIconButton } }) => ({
  smallIconButton,
  listItem: {
    background: '#fff',
  },
})

const PropertyList = ({
  propertyItems,
  classes,
  onEdit,
  onDelete,
  unusedList,
  onRevertUnused,
  subheader,
}) => (
  <List
    subheader={
      subheader && <ListSubheader component="div">{subheader}</ListSubheader>
    }
  >
    {propertyItems.map(({ id, label, name, icon: Icon }, index) => (
      <Fragment key={id}>
        <ListItem className={classes.listItem}>
          <Icon />
          <ListItemText primary={label} secondary={name} />
          <ListItemSecondaryAction>
            {unusedList ? (
              <IconButton
                aria-label="History"
                className={classes.smallIconButton}
                onClick={() => onRevertUnused(id)}
              >
                <HistoryIcon />
              </IconButton>
            ) : (
              <Fragment>
                <IconButton
                  aria-label="Edit"
                  className={classes.smallIconButton}
                  onClick={() => onEdit()}
                >
                  <EditOutlinedIcon />
                </IconButton>
                <IconButton
                  aria-label="Delete"
                  color="secondary"
                  className={classes.smallIconButton}
                  onClick={() => onDelete(id)}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Fragment>
            )}
          </ListItemSecondaryAction>
        </ListItem>
        {index !== propertyItems.length - 1 && (
          <li>
            <Divider inset />
          </li>
        )}
      </Fragment>
    ))}
  </List>
)

export default withStyles(styles)(PropertyList)
