using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{

    public class Unit : DerivedTweetSet
    {
        private Dictionary<string, int> wordLabels = null;

        private int x;
        private int y;
        private int unitID;
        private float[] unitWeightVector;

        private Dictionary<string, User> users;
        private Dictionary<string, int> userTweets;
        private SortedDictionary<float, HashSet<Tweet>> tweetsWithError;
        private Dictionary<Tweet, float> removeTweetsWithErrorHelper;
        private float sumError = 0;

        private Interval interval;

        #region Getter & Setter
        //public float[] UnitVector
        //{
        //    get
        //    {
        //        float[] averageVector = new float[this.UnitSumVector.Length];
        //        for (int i = this.UnitSumVector.Length - 1; i >= 0; --i)
        //        {
        //            averageVector[i] = this.UnitSumVector[i] / (float)this.TweetsCount;
        //        }
        //        return averageVector;
        //    }
        //}
        public int X
        {
            get{return this.x; }
            private set{this.x = value;}
        }
        public int Y
        {
            get{return this.y;}
            private set{ this.y = value; }
        }
        public int UnitID
        {
            get{ return this.unitID;}
            private set{this.unitID = value; }
        }
        //public float[] UnitSumVector
        //{
        //    get { return unitSumVector; }
        //    private set { unitSumVector = value; }
        //}

        public float[] UnitWeightVector
        {
            get { return unitWeightVector; }
            private set { unitWeightVector = value; }
        }

        public List<float[]> TFIDFVectors
        {
            get{ return this.tfidfVectors; }
            private set{ this.tfidfVectors = value;}
        }
        public Dictionary<string, User> Users
        {
            get { return users; }
            set { users = value; }
        }
        public Dictionary<string, int> WordLabels
        {
            get { return wordLabels; }
            set { wordLabels = value; }
        }
        public Interval Interval
        {
            get { return interval; }
            set { interval = value; }
        }
        public Dictionary<string, int> UserTweets
        {
            get { return userTweets; }
            set { userTweets = value; }
        }
        #endregion

        public Unit(int x, int y, int id, float[] weightVector,Interval interval)
            : base()
        {
            this.wordLabels = new Dictionary<string, int>();
            this.tfidfVectors = new List<float[]>();
            this.users = new Dictionary<string, User>();
            this.userTweets = new Dictionary<string, int>();
            this.tweetsWithError = new SortedDictionary<float, HashSet<Tweet>>();
            this.removeTweetsWithErrorHelper = new Dictionary<Tweet, float>();

            this.X = x;
            this.Y = y;
            this.UnitID = id;
            this.UnitWeightVector = weightVector;

            this.interval = interval;
            this.Vocabulary = interval.Vocabulary;

        }

        public void AddTweet(float error, Tweet tweet)
        {
            base.AddTweet(tweet);
            int index = this.Interval.Tweets.IndexOf(tweet);
            if (!this.tweetsWithError.ContainsKey(error))
            {
                this.tweetsWithError.Add(error, new HashSet<Tweet>());
            }
            this.tweetsWithError[error].Add(tweet);
            if (!this.removeTweetsWithErrorHelper.ContainsKey(tweet))
            {
                this.removeTweetsWithErrorHelper.Add(tweet, error);
            }
            this.sumError += error;

            this.SparseVector.Add(Interval.SparseVector[index]);
            float[] tfv = Interval.TFIDFVectors[index];
            this.tfidfVectors.Add(tfv);

            string[] words = tweet.DerivedContent.Split(' ');
            for (int i = 0; i < words.Length; ++i)
            {
                if (words[i] == "")
                    continue;
                if (WordLabels.ContainsKey(words[i]))
                    WordLabels[words[i]]++;
                else
                    WordLabels.Add(words[i], 1);
            }

            User user = tweet.User;
            if(user != null)
            {
                if (this.Users.ContainsKey(user.UserName))
                {
                    var num = this.UserTweets[user.UserName] + 1;
                    this.UserTweets[user.UserName] = num;
                }
                else
                {
                    this.Users.Add(user.UserName, user);
                    this.UserTweets.Add(user.UserName, 1);
                }
            }
        }

        public Tweet RemoveTweet(Tweet tweet)
        {
            int index = this.Tweets.IndexOf(tweet);
            this.tweetsWithError[this.removeTweetsWithErrorHelper[tweet]].Remove(tweet);
            this.removeTweetsWithErrorHelper.Remove(tweet);

            this.SparseVector.RemoveAt(index);
            this.tfidfVectors.RemoveAt(index);
            
            string[] words = tweet.DerivedContent.Split(' ');
            for (int i = 0; i < words.Length; ++i)
            {
                if (words[i] == "")
                    continue;
                if (WordLabels[words[i]] > 0)
                    WordLabels[words[i]]--;
                else
                    WordLabels.Remove(words[i]);
            }

            base.RemoveTweetAt(index);
            User user = tweet.User;
            if (user != null)
            {
                if (this.Users.ContainsKey(user.UserName))
                {
                    if (this.UserTweets[user.UserName] > 0)
                        this.UserTweets[user.UserName]--;
                    else
                    {
                        this.UserTweets.Remove(user.UserName);
                        this.Users.Remove(user.UserName);
                    }
                }
            }

            return tweet;
        }

        public List<Tweet> GetTweetsBelowAverrageError(float aError)
        {
            
            float[] keys = this.tweetsWithError.Keys.ToArray();
            int t = -1;
            for (int i = 0, len = keys.Length; i < len; ++i)
            {
                if (keys[i] < aError)
                    continue;
                else if( keys[i] > aError)
                {
                    t = i;
                    break;
                }
            }

            //If all tweets is below the global averrrage error, get the tweets above local averrage error
            if (t == -1)
            {
                float selfAError = this.sumError / this.TweetsCount;
                for (int i = 0, len = keys.Length; i < len; ++i)
                {
                    if (keys[i] < selfAError)
                        continue;
                    else if (keys[i] > selfAError)
                    {
                        t = i;
                        break;
                    }
                }
            }

            List<Tweet> result = new List<Tweet>();
            for (int i = t, len = keys.Length; i < len; ++i)
            {
                HashSet<Tweet> tweets = this.tweetsWithError[keys[i]];
                Tweet[] ta = tweets.ToArray();
                for (int j = 0, lenj = ta.Length; j < lenj; ++j)
                {
                    this.RemoveTweet(ta[j]);
                }
                result.AddRange(tweets);
            }

            return result;
        }
    }
}