/**
 * Function to standardize text input
 */

const standardizeTextInput = (t_: string): string => {

    //Format to lower case with no trailing whitespace
    return t_.toLowerCase().trim();

}

export default standardizeTextInput;