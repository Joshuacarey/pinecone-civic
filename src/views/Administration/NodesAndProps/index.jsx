import React from 'react'

import Grid from '@material-ui/core/Grid'

import AddNodeDialog from 'containers/AddNodeDialog'
import Dialog from 'components/Dialog'
import NodeOverview from 'components/NodeOverview'
import PageColumn from 'views/Page/PageColumn.jsx'
import PropForm from 'components/PropForm'
import RelationshipForm from 'components/RelationshipForm'
import TitleSubtitleList from 'containers/TitleSubtitleList'
import { nameToIconMap } from 'common/NameToIcon'

import { typeToReadableName } from 'common/PropTypeToMetadata'
import { nodes } from 'app'

/**
 * Placeholder while the model shape clears up.
 * @typedef {object} PropDef
 * @prop {string} name
 * @prop {string} propType
 */

/**
 * Placeholder while the model shape clears up.
 * @typedef {object} RelDef
 * @prop {string} iconName
 * @prop {string} name
 * @prop {Node} relatedNode
 */

/**
 * Placeholder while the model shape clears up.
 * @typedef {object} Node
 * @prop {string} iconName
 * @prop {string} identifier
 * @prop {string} label
 * @prop {string} name
 * @prop {Record<string, PropDef>} propDefs
 * @prop {Record<string, RelDef>} relDefs
 */

/**
 * @typedef {object} State
 * @prop {string[]} availablePropTypes
 * @prop {Record<string, Node>} nodes
 * @prop {string|null} selectedNodeKey
 * @prop {boolean} showingAddNodeDialog
 * @prop {boolean} showingAddRelDialog
 * @prop {boolean} showingPropDialog
 */

/**
 * @augments React.PureComponent<{}, State, never>
 */
export default class NodesAndProps extends React.PureComponent {
  /** @type {State} */
  state = {
    availablePropTypes: Object.keys(typeToReadableName),
    nodes: nodes.cache,
    propDefs: [],
    relDefs: [],
    selectedNodeKey: null,
    showingAddNodeDialog: false,
    showingAddRelDialog: false,
    showingPropDialog: false,
  }

  addPropForm = React.createRef()
  relForm = React.createRef()

  componentDidMount() {
    nodes.on(nodesValue => {
      this.setState({
        nodes: nodesValue,
      })
    })
  }

  componentWillUnmount() {}

  /** @private */
  handleClosePropForm = () => {
    this.setState({
      showingPropDialog: false,
    })
  }

  /** @private */
  onClickAddProperty = () => {
    const x = nodes.get(this.state.selectedNodeKey).get('propDefs')
    console.log(x)
    this.setState({
      showingPropDialog: true,
    })
  }

  /**
   * @private
   * @param {string} key
   */
  onClickNodeOnList = key => {
    this.setState({
      selectedNodeKey: key,
    })
  }

  /** @private */
  toggleAddNodeDialog = () => {
    this.setState(({ showingAddNodeDialog }) => ({
      showingAddNodeDialog: !showingAddNodeDialog,
    }))
  }

  /** @private */
  toggleAddRelDialog = () => {
    this.setState(({ showingAddRelDialog }) => ({
      showingAddRelDialog: !showingAddRelDialog,
    }))
  }

  handleRelSave = () => {
    const {
      label,
      maxNumRecords,
      name,
      nodeName,
    } = this.relForm.current.getFormData()

    this.setState(({ relDefs }) => ({
      relDefs: relDefs.concat({
        label: label | '',
        maxNumRecords: maxNumRecords | '',
        name: name | '',
        nodeName: nodeName | '',
        nodeKey: this.state.selectedNodeKey,
      }),
    }))

    this.toggleAddRelDialog()
  }

  handlePropSave = () => {
    const data = this.addPropForm.current.getFormData()

    const label = data.label
    const name = data.name
    const propType = data.type
    if (label == null) return
    if (name == null) return
    if (propType == null) return

    const tooltip = data.tooltip || ''

    const { selectedNodeKey } = this.state

    this.setState(({ propDefs }) => ({
      propDefs: propDefs.concat({
        label,
        name,
        propType,
        tooltip,
        nodeKey: selectedNodeKey,
      }),
    }))

    this.handleClosePropForm()
  }

  /**
   * @param {number} selectedIconIndex
   * @param {string} identifier
   * @param {string} label
   * @param {string} name
   * @returns {void}
   */
  handleSaveNode = (selectedIconIndex, identifier, label, name) => {
    nodes.set({
      iconName: Object.keys(nameToIconMap)[selectedIconIndex],
      identifier,
      label,
      name,
      propDefs: {},
      relDefs: {},
    })

    this.toggleAddNodeDialog()
  }

  render() {
    const {
      availablePropTypes,
      nodes,
      propDefs,
      relDefs,
      selectedNodeKey,
      showingAddNodeDialog,
      showingAddRelDialog,
      showingPropDialog,
    } = this.state
    const classes = { demo: '' }

    const thePropDefs = propDefs.filter(
      propDef => propDef.nodeKey === selectedNodeKey,
    )

    const theRelDefs = relDefs.filter(
      relDef => relDef.nodeKey === selectedNodeKey,
    )

    console.log(theRelDefs)

    const selectedNode = selectedNodeKey && nodes[selectedNodeKey]
    selectedNode && console.log(Object.keys(selectedNode.relDefs))
    return (
      <React.Fragment>
        <Dialog
          actionButtonText="SAVE"
          handleClose={this.handleClosePropForm}
          onClickActionButton={this.handlePropSave}
          open={showingPropDialog}
          title="Add a Property"
        >
          <PropForm
            availableTypes={availablePropTypes}
            ref={this.addPropForm}
          />
        </Dialog>

        <AddNodeDialog
          availableIconNames={Object.keys(nameToIconMap)}
          handleClose={this.toggleAddNodeDialog}
          handleSave={this.handleSaveNode}
          isValidIdentifierValue={() => true}
          isValidLabelValue={() => true}
          isValidNameValue={() => true}
          open={showingAddNodeDialog}
        />

        <Dialog
          actionButtonText="SAVE"
          onClickActionButton={this.handleRelSave}
          handleClose={this.toggleAddRelDialog}
          onClickCloseButton={this.toggleAddRelDialog}
          open={showingAddRelDialog}
          title="Add a Relationship"
        >
          <RelationshipForm
            availableNodeNames={Object.values(nodes).map(node => node.name)}
            ref={this.relForm}
          />
        </Dialog>

        <PageColumn titleText="Nodes And Properties">
          <Grid container>
            <Grid item>
              <TitleSubtitleList
                extractID={extractNodeKey}
                extractTitle={extractNodeName}
                onClickAdd={this.toggleAddNodeDialog}
                onClickItem={this.onClickNodeOnList}
                items={Object.entries(nodes).map(([key, node]) => ({
                  key,
                  ...node,
                }))}
                // TODO: optimize away array literal
                selectedIDs={
                  (selectedNodeKey && [selectedNodeKey]) || undefined
                }
                showToolbar
              />
            </Grid>

            <Grid item xs={12} sm={7} md={8} lg={9} className={classes.demo}>
              {selectedNode && (
                <NodeOverview
                  identifier={selectedNode.identifier}
                  iconName={selectedNode.iconName}
                  label={selectedNode.label}
                  name={selectedNode.name}
                  onClickAddProperty={this.onClickAddProperty}
                  onClickAddRelationship={this.toggleAddRelDialog}
                  properties={thePropDefs}
                  relationships={theRelDefs}
                />
              )}
            </Grid>
          </Grid>
        </PageColumn>
      </React.Fragment>
    )
  }
}

/** @param {Node & { key: string }} node */
const extractNodeKey = node => node.key

/** @param {Node} node */
const extractNodeName = node => node.name
