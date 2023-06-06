import React from 'react';

import Table from '../Table';
import { getRows } from './api.mock';
import columns from './columns.data';

export default class TableLazyLoading extends React.Component {
  state = {
    isLoading: true,
    rows: [],
    size: 0,
    page: 0,
    rowsPerPage: 5,
    sortedColumn: 'name',
    sortOrder: 'asc',
  };

  timer = null;

  onChangeHandler = ({ rowsPerPage, sortedColumn, sortOrder, filters, page }) => {
    const loadRows = () => {
      this.setState({ isLoading: true });
      getRows(page, rowsPerPage, sortedColumn, sortOrder, filters, columns).then(
        ({ rows, size }) => {
          this.setState({
            rows,
            size,
            page,
            rowsPerPage,
            sortedColumn,
            sortOrder,
            isLoading: false,
          });
        }
      );
    };
    if (page !== this.state.page) {
      clearTimeout(this.timer);
      this.setState({ page });
      this.timer = setTimeout(loadRows, 600);
    } else {
      loadRows();
    }
  };

  componentDidMount = () => {
    const { rowsPerPage, sortedColumn, sortOrder, page } = this.state;
    this.onChangeHandler({
      rowsPerPage,
      sortedColumn,
      sortOrder,
      filters: {},
      page,
    });
  };

  render() {
    const { isLoading, rows, size, page, rowsPerPage, sortedColumn, sortOrder } = this.state;
    return (
      <Table
        title="Employees"
        subtitle="Manage your employees"
        columns={columns}
        rows={rows}
        rowId="employeeId"
        isLoading={isLoading}
        onChange={this.onChangeHandler}
        size={size}
        page={page}
        rowsPerPage={rowsPerPage}
        sortedColumn={sortedColumn}
        sortOrder={sortOrder}
        filterDelay={600}
        rowsPerPageOptions={[5, 10, 15, 'All']}
        tablePaginationProps={{
          labelDisplayedRows: ({ from, to, count }) =>
            `${count === 1 ? 'Employee' : 'Employees'} ${from}-${to} of ${count}`,
          truncate: true,
        }}
      />
    );
  }
}
