export class Test {
	constructor( str )
	{
		this.message = str
	}
	alert()
	{
		alert( this.message || 'No message !' )
	}
	get isTest(){ return true }
}
