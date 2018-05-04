# cs590v-homework06

## Dataset

The dataset is the word frequency of source code of Django, which is a popular web framework written in Python. It is obtained by downloading the source code at [https://github.com/django/django](https://github.com/django/django) and analyzing it with Python program. The original dataset contains 24508 unique words and 2204 files have been parsed. Here, the word cloud has included the most common 100 words in Django source code. Additionally, the dataset has how many times one word appears in different files. By looking at this visualization, one can get a rough idea what task an unfamiliar library tries to finish (e.g. if "data" appears quite often in the source code, the library is probably a data analysis tool).

## Two Visualizations

The first is a word cloud showing the word frequency of source code. The second is a scatter plot where the X axis is how many files contains a particular word and the Y axis is word frequency over the entire repository.

## Probing and Selection

I implement two ways of selection. In the word cloud visualization, you can click on a word one by one, and the corresponding data points in the scatterplot will be highlighted. In the scatterplot, you can use brush to select multiple data points.

When you hover on a word or a data point in one visualization, the corresponding point is also highlighted in the other visualization.

## Another Interaction

A slider is provided to play with the *rotation* parameter. A dropdown is provided to filter the word cloud: to show all words, or only Python keywords, or only Django-related words.

## Extra Credit

Looking at the word cloud, `msgstr` and `msgid` are the largest two. This is unsurprising as Django is a web framework, so there must be a lot of processing of HTTP messages, etc.

For Python keywords, it is reasonable to see that the most frequently used one is `if`. But it is surprising to see that `is` appears in most files. My personal experience is not the same.
