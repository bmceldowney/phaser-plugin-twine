module.exports = {
	init: function () {
		this.macros = [];
		this.links = [];
		this.else = [];
		this.expression = '';
		this.startIndex = 0;
		this.endIndex = 0;
		this.type = '';
		this.content = '';
	},

	setContent: function (content) {
		this.content = content;
	},

	convertContent: function () {
		var tempContent;
		var macro;
		var linkCount = 0;
		var linkRegEx = /\[\[(.*?)\]\]/g;
		var self = this;

		for (var i = this.macros.length - 1; i >= 0; i--) {
			macro = this.macros[i];
			var offsetStart = macro.startIndex - this.contentStart;
			var offsetEnd = macro.endIndex - this.contentStart;

			tempContent = this.content.slice(0, offsetStart - 1) +
						'<<' + i + '>>' +
						this.content.slice(offsetEnd, this.content.length);

			this.content = tempContent;
		}

		this.content = this.content.replace(linkRegEx, function () {
			return '[[' + linkCount++ + ']]';
		});
	}
};
