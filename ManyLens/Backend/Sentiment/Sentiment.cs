using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using edu.stanford.nlp.sentiment;
using edu.stanford.nlp.pipeline;
using edu.stanford.nlp.ling;
using edu.stanford.nlp.util;
using edu.stanford.nlp.trees;
using edu.stanford.nlp.neural.rnn;
using java.util;
using System.IO;

namespace ManyLens.Backend.Sentiment
{
    public class Sentiment
    {
        private StanfordCoreNLP pipeline;
        public Sentiment()
        {
            Properties props = new Properties();
            props.setProperty("annotators", "tokenize, ssplit, parse, sentiment");

            var curDir = Environment.CurrentDirectory;
            var jarRoot = config.Parameter.RootFolder + "Backend\\DataBase\\models";
            Directory.SetCurrentDirectory(jarRoot);
            pipeline = new StanfordCoreNLP(props);
            Directory.SetCurrentDirectory(curDir);
        }

        public int findSentiment(string tweetContent)
        {
            //Properties props = new Properties();
            //props.setProperty("annotators", "tokenize, ssplit, parse, sentiment");

            //var curDir = Environment.CurrentDirectory;
            //var jarRoot = config.Parameter.RootFolder + "Backend\\DataBase\\models";
            //Directory.SetCurrentDirectory(jarRoot);
            //StanfordCoreNLP pipeline = new StanfordCoreNLP(props);
            //Directory.SetCurrentDirectory(curDir);

            int mainSentiment = 0;
            if(tweetContent != null && tweetContent.Length > 0)
            {
                int longest = 0;
                Annotation annotation = new Annotation(tweetContent);
                pipeline.annotate(annotation);
                var sentences = annotation.get(typeof(CoreAnnotations.SentencesAnnotation)) as ArrayList;

                foreach (CoreMap sentence in sentences)
                {
                    Tree tree = (Tree)sentence.get(typeof(SentimentCoreAnnotations.SentimentAnnotatedTree));
                    int sentiment = RNNCoreAnnotations.getPredictedClass(tree);
                    String partText = sentence.ToString();
                    if (partText.Length > longest)
                    {
                        mainSentiment = sentiment;
                        longest = partText.Length;
                    }
                }
            }
            return mainSentiment;
        }
    }
}