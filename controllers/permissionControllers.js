/**
 * These are dummy endpoints for "claims" or "roles" or "permissions" features. 
 *  Since these are based on my assumptions, 
 *  there implmentation is open for anyone to make more specific to
 *  their use cases.
 *  I am simply returning dummy success messages for each of them
 */

export const writePermission = async (req, res) => {
    //Send dummy success authorize message
    res.json({ message: 'Protected resource - Read access granted' });
}

export const readPermission = async (req, res) => {
    //Send dummy success authorize message
    res.json({ message: 'Protected resource - Read access granted' });
}

export const executePermission = async (req, res) => {
    //Send dummy success authorize message
    res.json({ message: 'Protected resource - Execute access granted' });
}