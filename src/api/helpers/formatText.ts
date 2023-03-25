import _                    from 'lodash';

/**
 * Function to standardize text input by removing trailing whitespace and converting all characters to lower case.
 */
export const standardizeTextInput = (v_: string): string => {

    //Format to lower case with no trailing whitespace
    return v_.toLowerCase().trim();

}

/**
 * Function to uppercase every word in a sentence
 */
export const titleCase = (v_: string): string => {

    //Standardize v_
    const sV_ = standardizeTextInput(v_);

    //Return v_ with capitalized letter at beginning of each word
    return _.startCase(sV_);

}

/**
 * Function to uppercase every letter at the start of a sentence in a multi sentence string
 */
export const sentenceCase = (v_: string): string => {

    const standardizedV_    = standardizeTextInput(v_);     //Remove trailing whitespace and convert to lower case
    const splitV_           = standardizedV_.split('.');    //Split into array of sentences

    //Loop through array and format each sentence to start with upper case letter, then join sentences into single string
    const fV_               = splitV_.map(s_ => _.startCase(s_)).join('. '); 

    //Return sentence cased multi-sentence string
    return fV_;

}