using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{
    public class LensData
    {
        private List<int> unitsID;


        private List<Tweet> tweets = null;

       // private List<Dictionary<string, int>> sparseVector = null;
        private Vocabulary vocabulary = null;

        private Dictionary<string, int> keywords = null;
        private Dictionary<string, User> users;
        private Dictionary<string, int> userTweets;



        private Interval interval;

        #region Getter&Setter
        public List<int> UnitsID
        {
            get { return unitsID; }
            set { unitsID = value; }
        }

        public virtual List<Tweet> Tweets
        {
            get
            {
                return this.tweets;
            }
            protected set
            {
                this.tweets = value;
            }
        }
        public int TweetsCount
        {
            get
            {
                return this.tweets.Count;
            }
        }
        public List<string> TweetIDs
        {
            get
            {
                List<string> ids = new List<string>();
                for (int i = 0, len = this.TweetsCount; i < len; ++i)
                {
                    ids.Add(this.Tweets[i].TweetID);
                }
                return ids;
            }
        }
        public List<string> TweetContents
        {
            get
            {
                List<string> content = new List<string>();
                for (int i = 0, len = this.TweetsCount; i < len; ++i)
                {
                    content.Add(this.Tweets[i].OriginalContent);
                }
                return content;
            }
        }

        //public List<Dictionary<string, int>> SparseVector
        //{
        //    get
        //    {
        //        return this.sparseVector;
        //    }
        //    set
        //    {
        //        this.sparseVector = value;
        //    }
        //}
        public Vocabulary Vocabulary
        {
            get
            {
                return this.vocabulary;
            }
            set
            {
                this.vocabulary = value;
            }
        }
        public int Dimension
        {
            get
            {
                return this.Vocabulary.Dimension;
            }
        }

        public Dictionary<string, User> Users
        {
            get { return users; }
            set { users = value; }
        }
        public List<KeyValuePair<string, int>> KeywordsDistribute
        {
            get
            {
                return keywords.ToList();
            }
        }
        public List<KeyValuePair<int, int>> TweetLengthDistribute
        {
            get
            {
                Dictionary<int, int> lengthDistribute = new Dictionary<int, int>();
                int len = this.TweetsCount;
                for (int i = 0; i < len; ++i)
                {
                    int index = this.Tweets[i].Length;
                    if (lengthDistribute.ContainsKey(index))
                        lengthDistribute[index]++;
                    else
                    {
                        lengthDistribute.Add(index, 1);
                    }
                }
                return lengthDistribute.ToList();
            }
        }
        public List<KeyValuePair<string, int>> HashTagDistribute
        {
            get
            {
                Dictionary<string, int> hashtagDistribute = new Dictionary<string, int>();
                int len = this.TweetsCount;
                for (int i = 0; i < len; ++i)
                {
                    List<string> hts = this.Tweets[i].HashTag;
                    foreach (string ht in hts)
                    {
                        if (hashtagDistribute.ContainsKey(ht))
                            hashtagDistribute[ht]++;
                        else
                        {
                            hashtagDistribute.Add(ht, 1);
                        }
                    }
                }
                return hashtagDistribute.ToList();
            }
        }
        public List<KeyValuePair<string, int>> UserTweetsDistribute
        {
            get
            {
                return this.userTweets.ToList();
            }
        }
        public Network RetweetNetwork
        {
            get
            {
                List<string> userNames = new List<string>();
                List<Node> nodes = new List<Node>();
                List<Link> links = new List<Link>();
                Random rnd = new Random();
                int len = this.TweetsCount;
                for (int i = 0; i < len; ++i)
                {
                    Tweet tweet = this.Tweets[i];
                    if (tweet.SourceUserName != null && this.Users.ContainsKey(tweet.SourceUserName))
                    {
                        int sourceIndex = userNames.IndexOf(tweet.SourceUserName);
                        int targetIndex = userNames.IndexOf(tweet.PostUserName);
                        if (sourceIndex == -1)
                        {
                            userNames.Add(tweet.SourceUserName);
                            nodes.Add(new Node() { userName = tweet.SourceUserName, x = rnd.NextDouble(), y = rnd.NextDouble() });
                            sourceIndex = nodes.Count - 1;

                        }
                        if (targetIndex == -1)
                        {
                            userNames.Add(tweet.PostUserName);
                            nodes.Add(new Node() { userName = tweet.PostUserName, x = rnd.NextDouble(), y = rnd.NextDouble() });
                            targetIndex = nodes.Count - 1;
                        }
                        links.Add(new Link() { source = sourceIndex, target = targetIndex });
                    }
                }
                return new Network() { links = links, nodes = nodes };
            }

        }
        #endregion

        public LensData(Unit unit)
        {
            this.unitsID = new List<int>();
            this.Vocabulary = unit.Vocabulary;
            this.interval = unit.Interval;

            this.unitsID.Add(unit.UnitID);

            this.Tweets = new List<Tweet>(unit.Tweets);
            //this.SparseVector = new List<Dictionary<string, int>>(unit.SparseVector);
            this.users = new Dictionary<string, User>(unit.Users);
            this.keywords = new Dictionary<string, int>(unit.WordLabels);
            this.userTweets = new Dictionary<string, int>(unit.UserTweets);
        }

        public void MergeUnit(Unit unit)
        {
            this.UnitsID.Add(unit.UnitID);
            this.Tweets.AddRange(unit.Tweets);

            //this.SparseVector.AddRange(unit.SparseVector);

            foreach (KeyValuePair<string, User> item in unit.Users)
            {
                if (!this.Users.ContainsKey(item.Key))
                {
                    this.Users.Add(item.Key, item.Value);
                }
            }
            foreach (KeyValuePair<string, int> item in unit.WordLabels)
            {
                if (this.keywords.ContainsKey(item.Key))
                {
                    this.keywords[item.Key] += item.Value;
                }
                else
                {
                    this.keywords.Add(item.Key, item.Value);
                }
            }
            foreach (KeyValuePair<string, int> item in unit.UserTweets)
            {
                if (this.userTweets.ContainsKey(item.Key))
                {

                    this.userTweets[item.Key] += item.Value;
                }
                else
                {
                    this.userTweets.Add(item.Key, item.Value);
                }
            }
        
        }
    }
}