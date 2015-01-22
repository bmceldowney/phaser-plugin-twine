module.exports = {
	init: function () {
		this.macros = [];
		this.else = [];
	},

  setContent: function (content) {
    this.content = content;
  },

	convertContent: function () {
	  var tempContent;
	  var macro;

	  if (!this.macros) { return; }

	  for (var i = this.macros.length - 1; i >= 0; i--) {
	    macro = this.macros[i]
	    var offsetStart = macro.startIndex - this.contentStart;
	    var offsetEnd = macro.endIndex - this.contentStart;

	    tempContent = this.content.slice(0, offsetStart - 1) +
	          '<<' + i + '>>' +
	          this.content.slice(offsetEnd, this.content.length);

	    this.content = tempContent;
	  };
	}
}
