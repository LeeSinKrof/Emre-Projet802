import {Notyf} from "notyf";
import 'notyf/notyf.min.css';

export const notyf = new Notyf({
    position: {
        x: 'right', y: 'bottom'
    },
    dismissible: true,
    duration: 4000,
    types: [
        {
            type: 'success',
            background: 'green',
            icon: {
                className: 'notyf__icon--success',
                tagName: 'i'
            }
        },
        {
            type: 'warning',
            background: 'orange',
            icon: {
                className: 'material-symbols:warning-rounded',
                tagName: 'i',
                text: 'warning'
            }
        },
        {
            type: 'error',
            background: 'red',
            icon: {
                className: 'material-symbols:error-rounded',
                tagName: 'i',
                text: 'error'
            }
        },
    ]
});

export const success = (message: string) => notyf.open({
    type: 'success',
    message
})

export const warning = (message: string) => notyf.open({
    type: 'warning',
    message
})

export const error = (message: string) => notyf.open({
    type: 'error',
    message
});