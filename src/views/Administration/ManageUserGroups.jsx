import React, { Component } from 'react';
import PropTypes from 'prop-types';
//material ui components
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
//material-ui icons
import Add from '@material-ui/icons/Add';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ErrorOutlineOutlined from '@material-ui/icons/ErrorOutlineOutlined';
import FilterList from '@material-ui/icons/FilterList';
import Print from '@material-ui/icons/Print';
import Search from '@material-ui/icons/Search';
import SwapVert from '@material-ui/icons/SwapVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//project components
import NewUserGroup from './NewUserGroup';
import PageColumn from 'views/Page/PageColumn.jsx';
// import GridItem from "components/Grid/GridItem.jsx";
// import GridContainer from "components/Grid/GridContainer.jsx";
// import CustomInput from "components/CustomInput/CustomInput.jsx";
// import NewProfile from "components/UserProfile/NewProfile.jsx";
// import EmployeeCard from 'components/UserProfile/EmployeeCard'
// import Card from "components/Card/Card.jsx";

import {
  AppBar,
  Dialog,
  Toolbar,
  Slide,
  Hidden,
  Paper,
  MenuItem,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanel,
  ListItemText,
  ListItemSecondaryAction,
  ListItem,
  List,
  TextField } from '@material-ui/core';

  //gundb
import Gun from 'gun/gun';

const formatData = data => Object.keys(data)
	.map(key => ({ key, ...data[key]  }))
	.filter(m => m.key !== '_')

const styles = theme => ({
	input: {
		marginBottom: -10,
		width: 215,
	},
	gridMainPanel: {
		flexGrow: 1,
		width: '100%',
	},
	mainPanel: {
		flexGrow: 1,
		paddingTop: 10,
		// paddingRight: 20,
		paddingBottom: 20,
		paddingLeft: 20,
		marginTop: 0,
		marginBottom: 0,
		width: '100%',
		height: '100%'
	},
	item: {
		border: '1px solid black',
		padding: 10,
		marginTop: 0,
	},
	itemSubContent: {
		paddingLeft: '25px'
	},
	grid: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 5,
	},
	userProfileGrid: {
		display: 'flex',	
		justifyContent: 'center',
		alignItems: 'center',
	},
	gridContainer: {
    flexGrow: 1,
		// display: 'flex',
    // justifyContent: 'center',
    // alignItems: "stretch",
    height: "100%",
	},
	renderUsers: {
    	overflow: 'auto',

    	height: '600px'
	},
	content: {
	},
	demo: {
		backgroundColor: "#f6f6f6",
		// width: "100%",
		height: "100%",
    overflow: 'scroll'
  },
	demoLeft: {
		backgroundColor: "#fff",
		// width: "100%",
    height: "100%",
    borderRight: '1px solid #ddd',
    overflow: 'scroll'
	},
	demoContent: {
    padding: 10,
    [theme.breakpoints.up('sm')]: {
      padding: 0,
    },
    [theme.breakpoints.up('md')]: {
      padding: 20,
    }
	},
	list: {
		width: "100%"
  },
  noGroups: {
    textAlign: 'center',
    padding: "40px 0"
  },
  icon: {
    fontSize: "50px",
    display: 'block',
    margin: "0 auto",
    color: "#999"
  },
  toolbar: {
    padding: '0 15px 15px 25px',
    [theme.breakpoints.up('sm')]: {
      padding: '15px 15px 15px 25px',
    }
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  selected: {
    backgroundColor: "#f00"
  },
  title: {
    marginBottom: 10
  },
  titlePadding: {
    marginBottom: 10,
    paddingLeft: 25,
  },
  icons: {
    cursor: 'pointer',
    '&:hover': {
      color: '#0dacc4',
    }
  },
  filterButton: {
    cursor: 'pointer',
    // float: 'right'
  },
  padding: {
    paddingLeft: 25
  },
  appBar: {
    // flexGrow: 1,
    dropShadow: 'none'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  grow: {
    flexGrow: 1,
  },
  noShadow: {
    dropShadow: 'none'
  },
  newTitle: {
    fontWeight: '900',
    textAlign: 'center',
    fontSize: '15px',
    textTransform: 'capitalize',
  },
  paddingFull: {
    padding: 15,
    [theme.breakpoints.up('md')]: {
      padding: 20,
    }
  },
  filters: {
    display: 'flex',
    justifyContent: 'space-between',
		alignItems: 'center',
  },
  records: {
    textAlign: 'center',
    paddingTop: 0,
    [theme.breakpoints.up('sm')]: {
      paddingTop: 10,
    }
  }
})

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const users = [
  { id: 1, name: "Administrator", status: "Active"},
  { id: 2, name: "User", status: "Inactive"},
  { id: 3, name: "User 3", status: "Inactive"},
  { id: 4, name: "User 4", status: "Inactive"},
  { id: 5, name: "User 5", status: "Inactive"},
  { id: 6, name: "User 6", status: "Inactive"},
  { id: 7, name: "User 7", status: "Inactive"},
  { id: 8, name: "User 8", status: "Inactive"},
  { id: 9, name: "User 9", status: "Inactive"},
  { id: 10, name: "User 10", status: "Inactive"},
  { id: 11, name: "User 11", status: "Inactive"},
  { id: 12, name: "User 12", status: "Inactive"},
]

class ManageUserGroups extends Component {
	constructor(props) {
		super(props);
		this.gun = Gun('https://pineconeserver.herokuapp.com/gun');
			this.state = {
        addUser: false,
        open: false, 
				users: users,
        usersCopy: users,
        selected: false,
        filterActive: false,
        title: '',
				first: '',
				last: '',
				group: '',
				email: '',
			}
		this.toggleViews = this.toggleViews.bind(this)
		this.showUser = this.showUser.bind(this)
	}
	componentDidMount() {
		let users = []
		this.gun.get('testRost').get('users').map().on((user, key) => {
			users[key] = user
			this.setState({ users: Object.assign({}, this.state.users, users) })
		})
	    window.scrollTo(0, 0);
	    document.body.scrollTop = 0;
	}
	componentWillMount() {
		let users = []
		this.gun.get('testRost').get('users').map().on((user, key) => {
			users[key] = user
			this.setState({ users: Object.assign({}, this.state.users, users) })
		})
	}
	toggleViews() {
    	this.setState({ addUser: !this.state.addUser })
  	}
  	showUser(user) {
		this.setState({ 
			first: user.first,
			last: user.last,
			email: user.email,
			group: user.groups
		})
		console.log(user)
    }
    
  renderUserGroups() {
		const { classes } = this.props
    if (!this.state.users.length) {
      return (
        <div className={classes.noGroups}>
          <ErrorOutlineOutlined className={classes.icon} />
          No User Groups found
        </div>
      )
    } else {
      return (
        <div style={{width: "100%"}}>
            <List component="nav" className={classes.list}>
              {this.state.users.map((item, index) => (
                <ListItem selected={this.state.selected === item.id-1} className={classes.list} key={index} onClick={()=> this.selectUser(item.id)}>
                  <ListItemText
                    primary={item.name}
                    secondary={item.status}
                  />
                  <Hidden smUp>
                    <ListItemSecondaryAction>
                      <IconButton>
                        <KeyboardArrowRight />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </Hidden>
                </ListItem>
              ))}
            {/* parsedData
              .map((user, i) => {
                if ( user.hasOwnProperty('first')) {
                  return (
                    <div key={i}>
                      <GridItem md={12} className={classes.grid} style={{ cursor: 'pointer' }}>
                        <Card className={classes.item} raised onClick={()=>this.showUser(user)}>
                          <Typography variant='title'>{user.first + ' ' + user.last}</Typography>
                          <div className={classes.itemSubContent}>
                            <Typography variant='body2'>{user.groups}</Typography>
                            <Typography variant='body1'>{user.home}</Typography>
                            <Typography variant='body1'>{user.email}</Typography>
                          </div>
                        </Card>
                      </GridItem>
                    </div>
                  )
                }
                })
              .reverse() */}
          </List>
        </div>
      )
    }
  }

  renderContent() {
		const { classes } = this.props
    const { users, selected } = this.state
    const user = users[selected]
    if (selected !== false) {
      return (
        <div>
          <Paper className={classes.root} elevation={1}>
            <div className={classes.paddingFull}>
              <Typography variant="h5" component="h4">
                {user.name}
              </Typography>
              <br/>
              <div>
                <TextField
                  id="standard-name"
                  label="Description"
                  fullWidth
                  // className={classes.textField}
                  value="Users will have administrator level permissions"
                  // onChange={this.handleChange('name')}
                />
                <TextField
                  id="standard-select-currency"
                  select
                  label="Status"
                  fullWidth
                  // className={classes.textField}
                  // value={this.state.currency}
                  // onChange={this.handleChange('currency')}
                  margin="normal"
                >
                  <MenuItem key={0} value={0}>
                    Active
                  </MenuItem>
                </TextField>
              </div>
            </div>
          </Paper>
          <br/>
          <br/>
          <Typography variant="title" noWrap className={classes.title}>Permissions</Typography>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Administration</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                sit amet blandit leo lobortis eget.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Tasks</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                sit amet blandit leo lobortis eget.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>People</Typography>
            </ExpansionPanelSummary>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Agencies</Typography>
            </ExpansionPanelSummary>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Events</Typography>
            </ExpansionPanelSummary>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Expenses</Typography>
            </ExpansionPanelSummary>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Mass Emails</Typography>
            </ExpansionPanelSummary>
          </ExpansionPanel>
        </div>
      )
    } else {
      return (
        <div>
          <div className={classes.noGroups}>
            <ErrorOutlineOutlined className={classes.icon} />
            No User Group selected
          </div>
        </div>
      )
    }
  }

  selectUser (id) {
    const openModal = window.innerWidth < 750
    const user = this.state.users[id-1]
    this.setState({selected: id-1, addUser: false, open: openModal, title: user.name})
  }

  addNewGroup () {
    const openModal = window.innerWidth < 750
    this.setState({ addUser: true, selected: false, open: openModal, title: 'New User Group' })
  }

  showSearch () {
    this.setState({filterActive: !this.state.filterActive})
  }

  onChangeFilter (e) {
    const value = e.target.value.toLowerCase()
    let users
    if (value === '') {
      users = this.state.usersCopy
    } else {
      users = this.state.users.filter((item) => item.name.toLowerCase().includes(value))
    }
    this.setState({ users })
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, title: '' });
  };

  renderContentWrapper() {
    console.log('renderContentWrapper', this.state);
    // this.openInModal();
    if (this.state.addUser) {
      return <NewUserGroup />
    } else {
      return this.renderContent()
    }
  }

	render() {
		const { classes } = this.props
		const { addUser, users } = this.state
    let parsedData = formatData(this.state.users)
    
		return (
			<div>
				<PageColumn component={'administration'} titleText={'User Groups'}>
					<Grid
						container
            className={classes.gridContainer}
					>
						<Grid item xs={12} sm={5} md={3} className={classes.demoLeft}>
							<div>
                <div className={classes.toolbar}>
                  <div className={classes.filters}>
                    <IconButton className={classes.icons}><Add onClick={()=>this.addNewGroup()} /></IconButton>
                    <IconButton className={classes.icons}><SwapVert /></IconButton>
                    <IconButton className={classes.icons}><Search /></IconButton>
                    <IconButton className={classes.icons}><Print /></IconButton>
                    <IconButton className={classes.icons}><FilterList onClick={()=>this.showSearch()} /></IconButton>
                  </div>
                  <div className={classes.records}>
                    {users.length} records
                  </div>
                  {this.state.filterActive && (
                    <div>
                      <TextField
                        type="search"
                        margin="normal"
                        fullWidth
                        placeholder="Search Groups"
                        onChange={(e)=> this.onChangeFilter(e)}
                      />
                    </div>
                  )}
                </div>
                <Divider />
								{/* <br/>
								<CustomInput
									id="search"
									// fullwidth={true}
									inputProps={{
										className: classes.input,
										type: "text",
										placeholder: 'Search',
										onChange: (e) => console.log(e),
										startAdornment: (
											<InputAdornment position="end">
												<IconButton color="inherit">
													<Search onClick={this.handleInputFocus} style={{fontSize: 25}}/>
												</IconButton>
											</InputAdornment>
										)
									}}
								/> */}
								{this.renderUserGroups()}
							</div>
						</Grid>
						<Grid item xs={12} sm={7} md={9} className={classes.demo}>
              <div className={classes.demoContent}>
                <Hidden smUp>
                  <Dialog
                    fullScreen
                    open={this.state.open}
                    onClose={this.handleClose}
                    TransitionComponent={Transition}
                    scroll='body'
                  >
                    <div className={classes.appBar}>
                      <AppBar position="static" color="default">
                        <Toolbar className={classes.noShadow}>
                          <IconButton className={classes.menuButton} color="default" onClick={this.handleClose} aria-label="Close">
                            <ArrowBack />
                          </IconButton>
                          <Typography variant="subtitle1" color="inherit" className={classes.newTitle}>
                            {this.state.title}
                          </Typography>
                        </Toolbar>
                      </AppBar>
                    </div>
                    <div className={classes.demoContent}>
                      {this.renderContentWrapper()}
                    </div>
                  </Dialog>
                </Hidden>
                {this.renderContentWrapper()}
              </div>
						</Grid>
					</Grid>
				</PageColumn>
			</div>

		)
	}
}
ManageUserGroups.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ManageUserGroups);	