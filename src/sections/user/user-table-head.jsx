import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
// import TableSortLabel from '@mui/material/TableSortLabel';

export default function UserTableHead({
  rowCount,
  headLabel,
  numSelected,
  onSelectAllClick,
  sort,
  setSort,
}) {
  const onSort = (property) => (event) => {
    setSort(true);
    if (property === 'secrets') {
      if (sort) {
        setSort(false);
      } else {
        setSort(true);
      }
    }
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>

        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            onClick={onSort(headCell.id)}
            sx={{ color: 'black', cursor: 'pointer' }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

UserTableHead.propTypes = {
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,

  onSelectAllClick: PropTypes.func,
  sort: PropTypes.bool,
  setSort: PropTypes.func,
};
