
import axios from 'axios';
export const deleteAccount = async function() {
    await axios({
        method: 'delete',
        url: 'http://localhost:3000/account/:username',
        data: {
            name: "cherry ",
            pass: "smith",
        }
    });
};

