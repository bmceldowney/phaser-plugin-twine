This is a converter for interactive fiction written in twine to the Plot Twister json format.
Currently converts twine stories written with twine 1.42 and then exported to twee source code.

To run:

    git clone git@github.com:bmceldowney/twine-plot_twister-converter.git
    cd twine-plot_twister-converter
    node index.js source_code.tw > plot_twister.json

Supported features:
* built-in macros:
  * if else

Unsupported features:
* external links

Roadmap
* add support for 

Caveats:
* passage titles cannot have '[' or ']' characters
