using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{

    public class Unit : DerivedTweetSet
    {
        private Dictionary<string, int> wordLabels = null;



        private float[] unitSumVector = null; //store as accumulate value


        private int x;
        private int y;
        private int unitID;
        private Dictionary<string, User> users;
        private Dictionary<string, int> userTweets;



        private Interval interval;


        #region Getter & Setter
        public float[] UnitVector
        {
            get
            {
                float[] averageVector = new float[this.UnitSumVector.Length];
                for (int i = this.UnitSumVector.Length - 1; i >= 0; --i)
                {
                    averageVector[i] = this.UnitSumVector[i] / (float)this.TweetsCount;
                }
                return averageVector;
            }
        }
        public int X
        {
            get
            {
                return this.x;
            }
            set
            {
                this.x = value;
            }
        }
        public int Y
        {
            get
            {
                return this.y;
            }
            set
            {
                this.y = value;
            }
        }
        public int UnitID
        {
            get
            {
                return this.unitID;
            }
            set
            {
                this.unitID = value;
            }
        }
        public float[] UnitSumVector
        {
            get { return unitSumVector; }
            set { unitSumVector = value; }
        }
        public List<float[]> TFIDFVectors
        {
            get
            {
                return this.tfidfVectors;
            }
            set
            {
                this.tfidfVectors = value;
            }
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



        public Unit(int x, int y, int id, Interval interval)
            : base()
        {
            this.wordLabels = new Dictionary<string, int>();
            this.tfidfVectors = new List<float[]>();
            this.users = new Dictionary<string, User>();
            this.userTweets = new Dictionary<string, int>();

            this.X = x;
            this.Y = y;
            this.UnitID = id;

            this.interval = interval;
            this.Vocabulary = interval.Vocabulary;

        }


        public new void AddTweet(Tweet tweet)
        {
            base.AddTweet(tweet);
            int index = this.Interval.Tweets.IndexOf(tweet);

            this.SparseVector.Add(Interval.SparseVector[index]);
            float[] tfv = Interval.TFIDFVectors[index];
            this.tfidfVectors.Add(tfv);
            if (this.UnitSumVector == null)
            {
                this.UnitSumVector = tfv;
            }
            else
            {
                for (int i = tfv.Length - 1; i >= 0; --i)
                {
                    this.UnitSumVector[i] += tfv[i];
                }
            }

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

        public Tweet RemoveTweet(Tweet tweet)
        {
            int index = this.Tweets.IndexOf(tweet);
            for (int i = this.UnitSumVector.Length - 1; i >= 0; --i)
            {
                this.UnitSumVector[i] -= this.tfidfVectors[index][i];
            }
            this.tfidfVectors.RemoveAt(index);
            Tweet t = base.RemoveTweetAt(index);
            return t;
        }
    }
}