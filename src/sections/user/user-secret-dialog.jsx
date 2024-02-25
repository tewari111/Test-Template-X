import PropTypes from 'prop-types';

import { Stack, Dialog, DialogTitle, DialogContent } from '@mui/material';

export default function SecretDialog( {open, name, secretes, show, commits, handleClose} ) {
    if(!open) return null;

    return (
        <div>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle> Secrets</DialogTitle>
            <DialogContent>
                <Stack spacing={3}>
                    <h1>{name}</h1>
                </Stack>
            </DialogContent>
        </Dialog>
        </div>
    );
}

SecretDialog.propTypes = {
    open: PropTypes.bool,
    name: PropTypes.string,
    secretes: PropTypes.string,
    show: PropTypes.string,
    commits: PropTypes.string,
    handleClose: PropTypes.func
}