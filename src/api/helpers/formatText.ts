import _ from 'lodash';

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
 * Function to capitalize the first letter in each sentence of a multi-sentence string
 * and add periods after each sentence if necessary.
 */
export const sentenceCase = (v_: string): string => {

    // Remove trailing whitespace and convert to lower case
    const standardizedV_ = standardizeTextInput(v_);
  
    // Split into array of sentences
    const sentences = standardizedV_.split(/(?<=[.?!])(?=\s+|$)/);
  
    // Loop through array and format each sentence to start with upper case letter
    const formattedSentences = sentences.map((sentence) => {
      
        // Trim any leading/trailing whitespace
      const trimmedSentence = sentence.trim();
  
      // Capitalize first letter of each sentence
      const capitalizedSentence = trimmedSentence.replace(
        /^\s*\w/,
        (c) => c.toUpperCase()
      );
  
      // Check if last character is a letter or not
      const lastCharIsLetter = /[a-zA-Z]$/.test(trimmedSentence);
  
      // Add period if last character is a letter
      if (lastCharIsLetter) {
        return `${capitalizedSentence}.`;
      } else {
        return capitalizedSentence;
      }
    });
  
    // Join sentences into single string with period and space
    const fV_ = formattedSentences.join(' ');
  
    return fV_;
    
  };