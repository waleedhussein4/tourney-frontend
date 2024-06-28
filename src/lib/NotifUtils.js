import { toast } from 'react-toastify';

export const createSavingToast = () => {
  return toast.info('Saving changes...', {
    position: "bottom-right",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "light",
  });
}

export const createDeletingToast = () => {
  return toast.info('Deleting ...', {
    position: "bottom-right",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "light",
  });
}

export const setToastSuccess = (toastId, message) => {
  return toast.update(toastId, {
    render: message,
    type: "success",
    autoClose: 5000
  });
}

export const setToastError = (toastId, message) => {
  return toast.update(toastId, {
    render: message,
    type: "error",
    autoClose: 5000
  });
}