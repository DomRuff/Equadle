import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';

import {EQUATIONS} from './equations';


/* 
##########################################

Constants, Maps, Interfaces and Enum

##########################################
*/
// Constants
const EQUATION_LENGTH = 8;
const NUM_TRIES = 6;

// Allowed terms
const TERMS = (() => {
  const ALLOWED_CHARACTERS = '0123456789+-*/=';
  const ret: {[key: string]: boolean} = {};
  for(const char of ALLOWED_CHARACTERS){
    ret[char] = true;
  }
  return ret;
})();

// Try interface
interface Try {
  terms: Term[];
}

// Term interface
interface Term {
  text: string;
  state: TermState;
}

// Term enum
enum TermState {
  WRONG,
  PARTIAL_MATCH,
  FULL_MATCH,
  PENDING,
}

/* 
##########################################

Angular

##########################################
*/
@Component({
  selector: 'app-equadle-game',
  standalone: true,
  imports: [],
  templateUrl: './equadle-game.component.html',
  styleUrl: './equadle-game.component.scss'
})


/* 
##########################################

Equadle Game Class

##########################################
*/
export class EquadleGameComponent {

  
  @ViewChildren('tryContainer') tryContainers!: QueryList<ElementRef>;

  /* 
##########################################

General Game Setup

##########################################
*/

  // Game state
  won !: boolean;
  targetEquation !: string;
  tries: Try[] = [];
  curTermIndex !: number;
  numSubmittedTries !: number;

  // Stores the count for each term from the target equation
  targetEquationTermCounts !: {[term: string]: number};


  // Keyboard rows and content, and current term states
  keyboardRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['+', '-', '*', '/', '=', 'Enter', 'Backspace'],
  ];
  curTermStates !: {[key: string]: TermState};
  TermState = TermState;


  // Message shown in the message panel
  infoMsg = '';
  fadeOutInfoMessage = false;


  constructor() {

    this.resetGame();
    
  }


  // Reset Game
  resetGame() {

    // Reset dynamic game values
    this.won = false;
    this.targetEquation = "";
    this.tries = [];
    this.curTermIndex = 0;
    this.numSubmittedTries = 0;

    this.targetEquationTermCounts = {};

    this.curTermStates = {};

    this.infoMsg = "";
    this.fadeOutInfoMessage = false;


    // Set states for each term
    this.setStates();

    // Set a target equation
    this.getEquation();

    // Get the term counts
    this.generateTermCounts();
  }


  setStates() {
    for (let i = 0; i < NUM_TRIES; i++) {
      const terms: Term[] = [];
      for (let j = 0; j < EQUATION_LENGTH; j++) {
        terms.push({text: '', state: TermState.PENDING});
      }
      this.tries.push({terms});
    }
  }

  generateTermCounts() {
    for (const term of this.targetEquation) {
      const count = this.targetEquationTermCounts[term];
      if (count == null) {
        this.targetEquationTermCounts[term] = 0;
      }
      this.targetEquationTermCounts[term]++;
    }
  }


  getEquation() {
    // Get a target equation from the equation list
    const numEquations= EQUATIONS.length;

    // Randomly select an equation
    const index = Math.floor(Math.random() * numEquations);
    const equation = EQUATIONS[index];
    this.targetEquation = equation;
  }



  /* 
##########################################

Keyboard handling

##########################################
*/
  // Handle keyboard events
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.handleClickKey(event.key);
  }

  // Handle a click on a keyboard key
  handleClickKey(key: string) {

    // Guard for an already won game
    if (this.won) {
      return;
    }

    // If key is a term, update the text in the corresponding term object
    if (TERMS[key]) {

      // Terms should only be placed in the current try row
      if (this.curTermIndex < (this.numSubmittedTries + 1) * EQUATION_LENGTH) {
        this.setTerm(key);
        this.curTermIndex++;
      }
    }
    // Handle delete
    else if (key === 'Backspace') {

      // Don't delete previous try
      if (this.curTermIndex > this.numSubmittedTries * EQUATION_LENGTH) {
        this.curTermIndex--;
        this.setTerm('');
      }
    }
    // Submit the current try and check
    else if (key === 'Enter') {
      this.checkCurrentTry();
    }
  }

  // Classes for a keyboard key based on its state
  getKeyClass(key: string): string {
    const state = this.curTermStates[key];
    switch (state) {
      case TermState.FULL_MATCH:
        return 'match key';
      case TermState.PARTIAL_MATCH:
        return 'partial key';
      case TermState.WRONG:
        return 'wrong key';
      default:
        return 'key';
    }
  }

  /* 
##########################################

Game Logic

##########################################
*/

  // Set the text into the current term object
  private setTerm(term: string) {
    const tryIndex = Math.floor(this.curTermIndex / EQUATION_LENGTH);
    const termIndex = this.curTermIndex - tryIndex * EQUATION_LENGTH;
    this.tries[tryIndex].terms[termIndex].text = term;
  }


  // Check the current try
  private async checkCurrentTry() {

    // Guard for not enough term
    const curTry = this.tries[this.numSubmittedTries];
    if (curTry.terms.some(term => term.text === '')) {
      this.showInfoMessage('Not enough terms!');
      return;
    }

    // Clone the counts mapping
    const targetEquationTermCounts = {...this.targetEquationTermCounts};
    const states: TermState[] = [];
    for (let i = 0; i < EQUATION_LENGTH; i++) {
      const expected = this.targetEquation[i];
      const curTerm = curTry.terms[i];
      const got = curTerm.text;
      let state = TermState.WRONG;

      // Only check terms not checked before
      if (expected === got && targetEquationTermCounts[got] > 0) {
        targetEquationTermCounts[expected]--;
        state = TermState.FULL_MATCH;
      } else if (
          this.targetEquation.includes(got) && targetEquationTermCounts[got] > 0) {
            targetEquationTermCounts[got]--
        state = TermState.PARTIAL_MATCH;
      }
      states.push(state);
    }

    // Animate the result

    // Get the current try container
    const tryContainer =
        this.tryContainers.get(this.numSubmittedTries)?.nativeElement as
        HTMLElement;

    // Get the term elements
    const termEles = tryContainer.querySelectorAll('.term-container');
    for (let i = 0; i < termEles.length; i++) {

      // Fold the term and apply result
      const curTermEle = termEles[i];
      curTermEle.classList.add('fold');

      // Wait for animation to finish
      await this.wait(180);

      // Update state
      curTry.terms[i].state = states[i];

      // Unfold.
      curTermEle.classList.remove('fold');
      await this.wait(180);
    }


    // Save to keyboard key states after current try has been submitted
    for (let i = 0; i < EQUATION_LENGTH; i++) {
      const curTerm = curTry.terms[i];
      const got = curTerm.text;
      const curStoredState = this.curTermStates[got];
      const targetState = states[i];

      // Override state with better result
      if (curStoredState == null || targetState > curStoredState) {
        this.curTermStates[got] = targetState;
      }
    }
    this.numSubmittedTries++;


    // Check if every term is a full match
    if (states.every(state => state === TermState.FULL_MATCH)) {
      this.showInfoMessage('Correct!');
      this.won = true;

      // Bounce animation
      for (let i = 0; i < termEles.length; i++) {
        const curTermEle = termEles[i];
        curTermEle.classList.add('bounce');
        await this.wait(160);
      }
      return;
    }

    // No more tries remaining
    if (this.numSubmittedTries === NUM_TRIES) {
      this.showInfoMessage(this.targetEquation, false);
    }
  }

/* 
##########################################

Info Messages

##########################################
*/

  private showInfoMessage(msg: string, hide = true) {
    this.infoMsg = msg;
    if (hide) {

      // Hide after 2s.
      setTimeout(() => {
        this.fadeOutInfoMessage = true;
        
        // Reset when animation is done.
        setTimeout(() => {
          this.infoMsg = '';
          this.fadeOutInfoMessage = false;
        }, 500);
      }, 2000);
    }
  }

  private async wait(ms: number) {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    })
  }

}
