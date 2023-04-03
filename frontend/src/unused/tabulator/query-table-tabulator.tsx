import React from 'react'
import { connect } from 'react-redux'
import ReactTabulator from './react-tabulator'
import "tabulator-tables/dist/css/tabulator_modern.min.css" // use Theme(s)
//import { ReactTabulator } from 'react-tabulator'
//import MultiValueFormatter from "react-tabulator/lib/formatters/MultiValueFormatter"
//import MultiSelectEditor from "react-tabulator/lib/editors/MultiSelectEditor"

interface Item {
  id: string,
  title?: string,
  created?: Date,
  tags?: string[],
}

interface Tags {
  tag: string,
  count?: number,
}

interface ItemProps {
  userItems: Item[],
  userTags: Tags[],
}

export class QueryTableTabulator extends React.Component <ItemProps, any> {
  public static defaultProps = { userItems: [{id:'',}], userTags: [{tag:''}]}

  tableColumns: any[] = [ //ColumnDefinition[] = [
    {formatter:"rowSelection", titleFormatter:"rowSelection", headerSort:false},
    { title: "Title", field: "title", },
    { title: "Created", field: "created", },
    { title: "Tags", field: "tags", 
      editor: "list",
      editorParams: { values: this.props.userTags?.map(({tag}) => {return tag}), sort:"asc" },

      /*editor: MultiSelectEditor,
        formatter: MultiValueFormatter, //React warning
        formatterParams: { style: "PILL" }*/
    },
  ]

  tableOptions = {
    layout: "fitDataStretch",
    movableRows: true,
    movableColumns: true,
    reactiveData: true,
    pagination: true,
      paginationSize: 5,
      paginationInitialPage: 1,
      paginationSizeSelector: [5,10,20,50,100],
  }

  render() { console.log("query-table-tabulator")
  //console.log(this.props.userTags?.map(({tag}) => {return {id:tag,name:tag}}))
    return (
      <ReactTabulator
        data={this.props.userItems}
        columns={this.tableColumns}
        options={this.tableOptions}
      />
    )
  }
}

const mapStateToProps = ({ query: { userItems, userTags }}:any) => ({
  userItems,
  userTags
})

export default connect(mapStateToProps, )(QueryTableTabulator)