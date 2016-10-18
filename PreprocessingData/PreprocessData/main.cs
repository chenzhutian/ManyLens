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

namespace PreprocessingData
{
    class main
    {
        static void Main()
        {
            //StreamReader sr = new StreamReader(@"..\..\..\..\ManyLens\Backend\DataBase\ProcessedTermsDatafifa2WithSentiment");

            //while (!sr.EndOfStream)
            //{
            //    string line = sr.ReadLine();

            //    string[] attributes = line.Split(new string[] { "CzTCZT" }, StringSplitOptions.None);
            //    // attributes[0] = attributes[0].Replace(@"/", "");

            //    if (attributes.Length >= 3)
            //    {
            //        string[] rawTweetsData = attributes[2].Split(new string[] { "CtZCTZ" }, StringSplitOptions.None);
            //        List<string> tweetsDataWithSentiment = new List<string>();
            //        for (int i = 0, len = rawTweetsData.Length; i < len; ++i)
            //        {
            //            string tempData = rawTweetsData[i];
            //            string[] tweetsAttribute = tempData.Split('\t');
            //            if (tweetsAttribute.Length < 8) continue;
            //            //0tweetId \t 1userId \t 2gpsA \t 3gpsB \t 4countryName \t 5hashTags \t 6derivedContent \t 7tweetContent \t 8sentiment
            //            Console.WriteLine(tweetsAttribute[8]);
            //        }
            //    }
            //}
            //sr.Close();

            //Console.WriteLine("finish all");
            //Console.ReadLine();
            // combineFile();
            calSentiment();
        }

        public static void combineFile()
        {
            StreamReader sr = new StreamReader(@"..\..\..\..\ManyLens\Backend\DataBase\ProcessedTermsDataebola0");
            StreamReader sr1 = new StreamReader(@"..\..\..\..\ManyLens\Backend\DataBase\ProcessedTermsDataebola0WithSentiment");
            StreamWriter sw = new StreamWriter(@"..\..\..\..\ManyLens\Backend\DataBase\ProcessedTermsDataebola0WithSentiment_");
           
            while (!sr.EndOfStream)
            {
                string line = sr.ReadLine();

                string[] attributes = line.Split(new string[] { "CzTCZT" }, StringSplitOptions.None);
                // attributes[0] = attributes[0].Replace(@"/", "");

                if (attributes.Length >= 3)
                {
                    sw.WriteLine(sr1.ReadLine());
                }
                else
                {
                    sw.WriteLine(line);
                }
            }
            sr.Close();
            sr1.Close();
            sw.Close();

            Console.WriteLine("finish all");
            Console.ReadLine();
        }

        public static void calSentiment()
        {
            StreamReader sr = new StreamReader(@"..\..\..\..\ManyLens\Backend\DataBase\ProcessedTermsDatafifa3");
            StreamWriter sw = new StreamWriter(@"..\..\..\..\ManyLens\Backend\DataBase\ProcessedTermsDatafifa3WithSentiment");
            Properties props = new Properties();
            props.setProperty("annotators", "tokenize, ssplit, parse, sentiment");

            var curDir = Environment.CurrentDirectory;
            var jarRoot = @"..\..\..\..\ManyLens\Backend\DataBase\models";
            Directory.SetCurrentDirectory(jarRoot);
            StanfordCoreNLP pipeline = new StanfordCoreNLP(props);
            Directory.SetCurrentDirectory(curDir);

            while (!sr.EndOfStream)
            {
                string line = sr.ReadLine();

                string[] attributes = line.Split(new string[] { "CzTCZT" }, StringSplitOptions.None);
                // attributes[0] = attributes[0].Replace(@"/", "");
                if (double.Parse(attributes[0]) > 20140709043000) break;
                if (attributes.Length >= 3)
                {
                    string[] rawTweetsData = attributes[2].Split(new string[] { "CtZCTZ" }, StringSplitOptions.None);
                    List<string> tweetsDataWithSentiment = new List<string>();
                    for (int i = 0, len = rawTweetsData.Length; i < len; ++i)
                    {
                        string tempData = rawTweetsData[i];
                        string[] tweetsAttribute = tempData.Split('\t');
                        if (tweetsAttribute.Length < 8) continue;
                        //0tweetId \t 1userId \t 2gpsA \t 3gpsB \t 4countryName \t 5hashTags \t 6derivedContent \t 7tweetContent
                        string tweetContent = tweetsAttribute[6];
                        int longest = 0;
                        int mainSentiment = 0;

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
                        tempData += '\t' + mainSentiment.ToString();
                        tweetsDataWithSentiment.Add(tempData);
                    }

                    sw.WriteLine(attributes[0] + "CzTCZT" + attributes[1] + "CzTCZT" + String.Join("CtZCTZ", tweetsDataWithSentiment));
                }
                else
                {
                    sw.WriteLine(line);
                }
            }
            sr.Close();
            sw.Close();

            Console.WriteLine("finish all");
            Console.ReadLine();
        }
    }
}
