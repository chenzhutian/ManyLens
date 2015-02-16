using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MSRA.NLC.Sentiment.Common;
using MSRA.NLC.Sentiment.Core;
using MSRA.NLC.Common.NLP;
using System.IO;
using MSRA.NLC.Common.MLT;
using MSRA.NLC.Common.NLP.Twitter;

namespace SentimentConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("[LOG] /BEGIN AT {0}\n", DateTime.Now.ToString());

            Constants.SPP_RootPath = @"../../../../root";

            ITokenizer tokenizer = new TwitterTokenizer();
            IWordNormalizer wordNormalizer = new TweetWordNormalizer();
            ITextConverter textConverter = new BaseTextConverter(tokenizer, null, null, wordNormalizer);


            classifier = "LIBLINEAER";
            //classifier = "svm_light";

            ISemanticTagger lexiconTagger = new LexiconSentimentTagger(tokenizer);

            SECoreImpl coreImpl = CreateLearningCoreImpl(Constants.SPP_RootPath);
            SentimentEngine engine = new SentimentEngine(textConverter, lexiconTagger, coreImpl);

            Console.WriteLine("\n[LOG] /END AT {0}\n", DateTime.Now.ToString());

            Console.WriteLine("\nPlease Input a Sentence:\n");

            while (true)
            {
                string sentence = Console.ReadLine();
                if (string.IsNullOrWhiteSpace(sentence))
                    continue;

                sentence = sentence.Trim();

                if (sentence == "q")
                    break;
                
                AnalyzeSentiment(engine, sentence);
            }
        }

        static void AnalyzeSentiment(SentimentEngine engine, string sentence)
        {
            IList<Sentiment> sentiments = engine.Analyze(sentence);

            int success_code = -1;
            if (sentiments != null && sentiments.Count > 0)
            {
                StringBuilder sb = new StringBuilder();

                foreach (Sentiment sentiment in sentiments)
                {
                    sb.Append(sentiment.Polarity).Append("\t").Append(sentiment.Score).Append("\n");

                    if (sentiment.Trace != null)
                        sb.Append(sentiment.Trace).Append("\n");

                    Dictionary<string, double> clues = sentiment.Clues;
                    if (clues != null)
                    {
                        foreach (string word in clues.Keys)
                        {
                            sb.Append(word).Append(" | ").Append(clues[word]).Append("\n");
                        }
                    }

                    sb.Append("\n");
                }

                Console.WriteLine(sb.ToString().Trim());

                success_code = 0;
            }

            if (success_code < 0)
            {
                Console.WriteLine("N/A");
            }

            Console.WriteLine();
        }

        static SECoreImpl CreateLearningCoreImpl(string root)
        {
            string path = Path.Combine(root, @"model\sentiment\learning\");

            string subFeatureSetFilePath = Path.Combine(path, @"sub.fv");
            string subjectivityModelFilePath = Path.Combine(path, @"sub.model");
            BaseFeatureExtractor subFeatureExtractor = null;
            BaseDecoder sub_decoder = null;
            if (File.Exists(subFeatureSetFilePath) && File.Exists(subjectivityModelFilePath))
            {
                subFeatureExtractor = new SubjectivityFeatureExtractor(subFeatureSetFilePath);
                sub_decoder = CreateDecoder(subjectivityModelFilePath, classifier);
            }

            string polFeatureSetFilePath = Path.Combine(path, @"pol.fv");
            BaseFeatureExtractor polFeatureExtractor = new PolarityFeatureExtractor(polFeatureSetFilePath);

            string polarityModelFilePath = Path.Combine(path, @"pol.model");
            BaseDecoder pol_decoder = CreateDecoder(polarityModelFilePath, classifier);

            SELearningCoreImpl coreImpl = new SELearningCoreImpl(subFeatureExtractor, polFeatureExtractor,
                sub_decoder, pol_decoder);

            return coreImpl;
        }

        static BaseDecoder CreateDecoder(string model, string classifier)
        {
            BaseDecoder decoder = null;
            if (classifier == "LIBLINEAER")
            {
                decoder = new LibLinearDecoder(model);
            }
            else
            {
                decoder = new SVMDecoder(model);
            }

            return decoder;
        }

        private static string classifier = "LIBLINEAER"; //"svm_light"
    }
}
