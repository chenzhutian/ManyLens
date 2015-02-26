﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{
    public class LensData
    {
        private String mapID;

        //private List<int> unitsID;
        private List<Unit> units;
        private List<Tweet> tweets = null;

        private Dictionary<string, int> keywords = null;
        private Dictionary<string, User> users = null;
        private Dictionary<string, int> usersCount = null; // the occurence time of each user in each unit
        private Dictionary<string, int> userTweets = null; // the tweets number of each user

        private Dictionary<int, List<Tweet>> tweetsLengthDistribute = null;

        //private List<Dictionary<string, int>> sparseVector = null;
        //private Vocabulary vocabulary = null;
        //private Interval interval;

        #region Getter&Setter
        //public List<int> UnitsID
        //{
        //    get { return unitsID; }
        //    set { unitsID = value; }
        //}
        public String MapID
        {
            get { return mapID; }
            set { mapID = value; }
        }
        public virtual List<Tweet> Tweets
        {
            get { return this.tweets; }
            protected set { this.tweets = value; }
        }

        public int TweetsCount
        {
            get { return this.tweets.Count; }
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
                if (this.tweetsLengthDistribute != null)
                {
                    foreach(KeyValuePair<int,List<Tweet>> item in this.tweetsLengthDistribute)
                    {
                        lengthDistribute.Add(item.Key, item.Value.Count);
                    }
                }
                else
                {
                    this.tweetsLengthDistribute = new Dictionary<int, List<Tweet>>();
                    int len = this.TweetsCount;
                    for (int i = 0; i < len; ++i)
                    {
                        int index = this.Tweets[i].Length;
                        if (lengthDistribute.ContainsKey(index))
                        {
                            lengthDistribute[index]++;
                        }
                        else
                        {
                            lengthDistribute.Add(index, 1);
                            this.tweetsLengthDistribute.Add(index,new List<Tweet>());
                        }
                        this.tweetsLengthDistribute[index].Add(this.Tweets[i]);
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
        //public Vocabulary Vocabulary
        //{
        //    get { return this.vocabulary; }
        //    set { this.vocabulary = value; }
        //}
        //public int Dimension
        //{
        //    get { return this.Vocabulary.Dimension; }
        //}

        #endregion

        private void InitialLensData()
        {
            //this.unitsID = new List<int>();
            this.units = new List<Unit>();
            this.Tweets = new List<Tweet>();
            this.usersCount = new Dictionary<string, int>();

            this.users = new Dictionary<string, User>();
            this.keywords = new Dictionary<string, int>();
            this.userTweets = new Dictionary<string, int>();
        }

        private void InitialLensData(Unit unit)
        {
           
            this.units = new List<Unit>();
            this.units.Add(unit);
            //this.unitsID = new List<int>();
            //this.unitsID.Add(unit.UnitID);
            //this.Vocabulary = unit.Vocabulary;
            //this.interval = unit.Interval;

            this.Tweets = new List<Tweet>(unit.Tweets);
            this.usersCount = new Dictionary<string, int>();
            foreach (KeyValuePair<string, User> item in unit.Users)
            {
                this.usersCount.Add(item.Key, 1);
            }

            this.users = new Dictionary<string, User>(unit.Users);
            this.keywords = new Dictionary<string, int>(unit.WordLabels);
            this.userTweets = new Dictionary<string, int>(unit.UserTweets);
        }

        public LensData()
        {
            this.InitialLensData();
        }

        public LensData(Unit unit)
        {
            this.InitialLensData(unit);
        }

        private void DetechUnit(Unit unit)
        {
            if (!this.units.Contains(unit))
                return;
            this.units.Remove(unit);
            //if (!this.UnitsID.Contains(unit.UnitID))
            //    return;
            //this.UnitsID.Remove(unit.UnitID);
            
            for (int i = 0, len = unit.TweetsCount; i < len; ++i)
            {
                this.Tweets.Remove(unit.Tweets[i]);
            }
            //Remove user
            foreach (KeyValuePair<string, User> item in unit.Users)
            {
                if (--this.usersCount[item.Key] == 0)
                {
                    this.usersCount.Remove(item.Key);
                    this.Users.Remove(item.Key);
                    this.userTweets.Remove(item.Key);
                }
            }
            //Remove tweets of users
            foreach (KeyValuePair<string, int> item in unit.UserTweets)
            {

                if (this.userTweets.ContainsKey(item.Key))
                {
                    this.userTweets[item.Key] -= item.Value;
                    if (this.userTweets[item.Key] == 0)
                    {
                        this.userTweets.Remove(item.Key);
                    }
                }

            }
            //Remove keyword size
            foreach (KeyValuePair<string, int> item in unit.WordLabels)
            {
                if (this.keywords.ContainsKey(item.Key))
                {
                    this.keywords[item.Key] -= item.Value;
                    if (this.keywords[item.Key] == 0)
                    {
                        this.keywords.Remove(item.Key);
                    }
                }
            }

        }

        private void MergeUnit(Unit unit)
        {
            this.units.Add(unit);
            //this.UnitsID.Add(unit.UnitID);
            this.Tweets.AddRange(unit.Tweets);

            //Add the user to this lens
            foreach (KeyValuePair<string, User> item in unit.Users)
            {
                if (!this.Users.ContainsKey(item.Key))
                {
                    this.Users.Add(item.Key, item.Value);
                    this.usersCount.Add(item.Key, 1);
                }
                else
                {
                    this.usersCount[item.Key]++;
                }
            }
            //Add the tweets number of each user to this lens
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
            //Add the keyword size of each keyword to this lens
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
        }

        public void BindUnits(List<Unit> newUnits)
        {

            //List<int> newUnitsID = new List<int>();
            List<Unit> enter = new List<Unit>();
            List<Unit> exit = new List<Unit>();
            int originalNum = this.units.Count;

            //get the exit unit
            for (int i = 0, len = this.units.Count; i < len; ++i)
            {
                if (!newUnits.Contains(this.units[i]))
                {
                    exit.Add(this.units[i]);
                }
            }

            //if all unit exit, reConstruct this lensData then return
            if (exit.Count == originalNum)
            {
                this.InitialLensData(newUnits[0]);
                for (int i = 1, len = newUnits.Count; i < len; ++i )
                {
                    this.MergeUnit(newUnits[i]);
                }
                return;
            }

            //Get exnter unit
            for (int i = 0, len = newUnits.Count; i < len; ++i)
            {
                if (!this.units.Contains(newUnits[i]))
                {
                    enter.Add(newUnits[i]);
                }
            }
            
            //Detech the exit unit
            for(int i = 0, len = exit.Count; i < len; ++i)
            {
                this.DetechUnit(exit[i]);
            }
            for (int i = 0, len = enter.Count; i < len; ++i)
            {
                this.MergeUnit(enter[i]);
            }

        }

        public List<Tweet> GetTweetsAtLengthOf(int length)
        {
            return this.tweetsLengthDistribute[length];
        }

        public UnitsDataForLens GetDataForVis()
        {

            return new UnitsDataForLens()
            {
                //unitsID = this.UnitsID,
                contents = this.TweetContents,
                keywordsDistribute = this.KeywordsDistribute,
                tweetLengthDistribute = this.TweetLengthDistribute,
                hashTagDistribute = this.HashTagDistribute,
                userTweetsDistribute = this.UserTweetsDistribute,
                retweetNetwork = this.RetweetNetwork
                // tweetIDs = unit.TweetIDs
            };
        }
    }
}