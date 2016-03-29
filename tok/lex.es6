import CheddarTokens from './tks';

export default class CheddarLexer {
    constructor(Code, Index) {
        this.Code  = Code;
        this.Index = Index;
        
        this._Tokens = [];
    }

    getChar() {
        if (this.Code[this.Index])
            return this.Code[this.Index++];
        else return false;
    }

    newToken(fill = '') { this._Tokens[this._Tokens.push(fill) - 1]; return this }
    addToken(char = '') { this._Tokens[this._Tokens.length - 1] += char; return this }

    get last() { return this._Tokens[this._Tokens.length - 1] }
    
    open(forceNot) {
        if (this.Code === null || this.Index === null)
            throw new TypeError('CheddarLexer: uninitialized code, index.');
        else if (forceNot !== false)
            this.newToken();
    }
    close() { delete this.Code; return this }
    error(id) { throw new Error(id.toString()) }
    //TODO: is this intended behavior?

    get Tokens() { return new CheddarTokens(this._Tokens) }
    set Tokens(v) { this._Tokens.push(v) }
    
    get isLast() { return this.Index === this.Code.length }
    
    parse(parseClass, ...args) {
        if (parseClass.prototype instanceof CheddarLexer) {
            let Parser = new parseClass(this.Code, this.Index).exec(...args);
            
            this.Tokens = Parser;
            this.Index = Parser.Index;
            
            return this;
        } else {
            throw new TypeError('CheddarLexer: provided parser is not a CheddarLexer');
        }
    }
    
    jumpWhite() {
        const WHITESPACE_REGEX = /\s/;
        while(WHITESPACE_REGEX.test(this.Code[this.Index]))
            this.Index++;
        return this;
    }
    
    jumpLiteral(l) {
        if (this.Code.indexOf(l) === this.Index)
            this.Index += l.length;
        else
            return false;
        return this;
    }
}