using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using ManyLens.Models;

namespace ManyLens.Preprocessing
{
    public class TweetsVectorizer
    {
        public async static Task VectorizeEachTweet(Interval interval,IProgress<double> progress)
        {
            if (interval.HasVectorized)
                return;

            Dictionary<string,int> vocabulary = new Dictionary<string,int>();
            Dictionary<string,int> dfOfWords = new Dictionary<string,int>();
            Dictionary<string,int> idOfWords = new Dictionary<string,int>();
            List<Dictionary<string,int>> vectors = new List<Dictionary<string,int>>();

            await Task.Run(() => 
            {
                int tweetsCount = interval.TweetsCount;
                for (int i = 0, percent = 0 ; i < tweetsCount; ++i)
                {
                    Dictionary<string, int> tempVector = new Dictionary<string, int>();
                    string[] words = interval.GetTweetDerivedContentAt(i).Split(' ');
                    for (int j = words.Length - 1; j >= 0; --j)
                    {
                        string word = words[j];
                        if (vocabulary.ContainsKey(word))
                        {
                            if (tempVector.ContainsKey(word))
                            {
                                tempVector[word]++;
                            }
                            else
                            {
                                vocabulary[word]++;
                                tempVector.Add(word, 1);
                            }
                        }
                        else
                        {
                            vocabulary.Add(word, 1);
                            tempVector.Add(word, 1);
                        }
                    }
                    vectors.Add(tempVector);

                    if ((double)i / tweetsCount > (double)percent / 50.0)
                    {
                        progress.Report(percent/100.0);
                        ++percent;
                    }
                }

                int dimension = 0;
                List<string> keys = vocabulary.Keys.ToList();
                for (int i = keys.Count - 1; i >= 0; --i)
                {
                    string key = keys[i];
                    int value = vocabulary[key];
                    if (value > (double)tweetsCount / 500.0 && value < (double)tweetsCount * 0.1)
                    {
                        dfOfWords.Add(key, value);
                        idOfWords.Add(key, dimension++);
                    }
                }

                int vectorCount = vectors.Count - 1;
                for (int i = vectorCount,percent = 0; i >= 0; --i)
                {
                    Dictionary<string, int> vector = vectors[i];
                    keys = vector.Keys.ToList();
                    Dictionary<string, int> cleanVector = new Dictionary<string, int>();
                    for (int j = 0; j < keys.Count; ++j)
                    {
                        string key = keys[j];
                        int value = vector[key];
                        if (dfOfWords.ContainsKey(key))
                        {
                            cleanVector.Add(key, value);
                        }
                    }

                    if (cleanVector.Count == 0)
                    {
                        vectors.RemoveAt(i);
                        interval.RemoveTweetAt(i);
                    }
                    else
                    {
                        cleanVector = (from item in cleanVector
                                       orderby item.Value descending
                                       select item).ToDictionary(pair => pair.Key, pair => pair.Value);
                        vectors[i] = cleanVector;
                    }

                    if ((double)(tweetsCount - i) / tweetsCount > (double)percent / 50.0)
                    {
                        progress.Report((double)(50+percent)/100.0);
                        ++percent;
                    }
                }

                dfOfWords = (from item in dfOfWords
                             orderby item.Value descending
                             select item).ToDictionary(pair => pair.Key, pair => pair.Value);
                idOfWords = (from item in idOfWords
                             orderby item.Value descending
                             select item).ToDictionary(pair => pair.Key, pair => pair.Value);

                interval.SparseVector = vectors;
                interval.Vocabulary = new Vocabulary(idOfWords, dfOfWords);

                interval.HasVectorized = true;
            });

        }
    }
}