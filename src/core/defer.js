// + 把promise封装成Deferred，参考jQuery.Deffered
// > see: https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred
export function Deferred() {
  const PromiseUtils = window.PromiseUtils || {};
  // #! update 062115 for typeof
  if (typeof Promise !== 'undefined' && Promise.defer) {
    // #! need import of Promise.jsm for example: Cu.import('resource:/gree/modules/Promise.jsm');
    return Promise.defer();
  } else if (typeof PromiseUtils !== 'undefined'  && PromiseUtils.defer) {
    // #! need import of PromiseUtils.jsm for example: Cu.import('resource:/gree/modules/PromiseUtils.jsm');
    return PromiseUtils.defer();
  } else {
    /* A method to resolve the associated Promise with the value passed.
  	 * If the promise is already settled it does nothing.
  	 *
  	 * @param {anything} value : This value is used to resolve the promise
  	 * If the value is a Promise then the associated promise assumes the state
  	 * of Promise passed as value.
  	 */
    this.resolve = null;
    /* A method to reject the assocaited Promise with the value passed.
  	 * If the promise is already settled it does nothing.
  	 *
  	 * @param {anything} reason: The reason for the rejection of the Promise.
  	 * Generally its an Error object. If however a Promise is passed, then the Promise
  	 * itself will be the reason for rejection no matter the state of the Promise.
  	 */
    this.reject = null;
    /* A newly created Pomise object.
  	 * Initially in pending state.
  	 */
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    Object.freeze(this);
  }
}
