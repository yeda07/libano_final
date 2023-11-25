import PropTypes from 'prop-types';
import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel, TextField } from '@mui/material';

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

CreditListHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  isAuthenticated: PropTypes.bool.isRequired,
  isSuperUser: PropTypes.bool.isRequired,
};

export default function CreditListHead({
  order,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onRequestSort,
  onSelectAllClick,
  filterName,
  onFilterName,
  isAuthenticated,
  isSuperUser,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const handleFilterNameChange = (event) => {
    onFilterName(event.target.value);
  };

  // Si el usuario no está autenticado o no es un superusuario, no muestra el componente
  if (!isAuthenticated || !isSuperUser) {
    return null;
  }

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
            align={headCell.alignRight ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell>
          <TextField
            fullWidth
            size="small"
            value={filterName}
            onChange={handleFilterNameChange}
            placeholder="Filter by Name"
            variant="outlined"
          />
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
