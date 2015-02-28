using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{
    public class LensData
    {
        private String mapID;

        //private List<int> unitsID;
        private List<Unit> units;
        private List<Tweet> tweets;

        private Dictionary<string, int> keywords;
        private Dictionary<string, User> users;
        private Dictionary<string, int> usersCount; // the occurence time of each user in each unit
        private Dictionary<string, int> userTweets; // the tweets number of each user

        private Dictionary<int, List<Tweet>> tweetsLengthDistribute;
        private Dictionary<int, HashSet<string>> wordsOfTweetsAtSpecificLength;
        private Dictionary<string, List<Tweet>> tweetsLocationDistribute;
        //private List<Dictionary<string, int>> sparseVector = null;
        //private Vocabulary vocabulary = null;
        //private Interval interval;

        #region Getter&Setter
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
                foreach (KeyValuePair<int, List<Tweet>> item in this.tweetsLengthDistribute)
                {
                    lengthDistribute.Add(item.Key, item.Value.Count);
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
        public List<KeyValuePair<string, int>> TweetsLocationDistribute
        {
            get
            {
                Dictionary<string, int> distribute = new Dictionary<string, int>();
                foreach(KeyValuePair<string,List<Tweet>> item in this.tweetsLocationDistribute)
                {
                    distribute.Add(item.Key, item.Value.Count);
                }
                return distribute.ToList();
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


            this.keywords = new Dictionary<string, int>();
            this.users = new Dictionary<string, User>();
            this.usersCount = new Dictionary<string, int>();
            this.userTweets = new Dictionary<string, int>();

            this.tweetsLengthDistribute = new Dictionary<int, List<Tweet>>();
            this.wordsOfTweetsAtSpecificLength = new Dictionary<int, HashSet<string>>();
            this.tweetsLocationDistribute = new Dictionary<string, List<Tweet>>();
        }

        //private void InitialLensData(Unit unit)
        //{
            
        //    this.units = new List<Unit>();
        //    this.units.Add(unit);
        //    this.Tweets = new List<Tweet>(unit.Tweets);

        //    this.keywords = new Dictionary<string, int>(unit.WordLabels);
        //    this.users = new Dictionary<string, User>(unit.Users);
        //    this.usersCount = new Dictionary<string, int>();
        //    foreach (KeyValuePair<string, User> item in unit.Users)
        //    {
        //        this.usersCount.Add(item.Key, 1);
        //    }
        //    this.userTweets = new Dictionary<string, int>(unit.UserTweets);

        //    this.wordsOfTweetsAtSpecificLength = new Dictionary<int, HashSet<string>>();
        //    this.tweetsLengthDistribute = null;
        //    //this.unitsID = new List<int>();
        //    //this.unitsID.Add(unit.UnitID);
        //    //this.Vocabulary = unit.Vocabulary;
        //    //this.interval = unit.Interval;
        //}

        public LensData()
        {
            this.InitialLensData();
        }

        //public LensData(Unit unit)
        //{
        //    this.InitialLensData(unit);
        //}

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
                Tweet tweet = unit.Tweets[i];
                this.Tweets.Remove(tweet);
                int length = tweet.Length;
                this.tweetsLengthDistribute[length].Remove(tweet);
                if (this.tweetsLengthDistribute[length].Count == 0)
                    this.tweetsLengthDistribute.Remove(length);
                string countryName = tweet.CountryName;
                if (countryName != null)
                {
                    this.tweetsLocationDistribute[countryName].Remove(tweet);
                    if (this.tweetsLocationDistribute[countryName].Count == 0)
                        this.tweetsLocationDistribute.Remove(countryName);
                }
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
            for (int i = 0, len = unit.Tweets.Count; i < len; ++i)
            {
                Tweet tweet = unit.Tweets[i];
                int length = tweet.Length;
                if (!this.tweetsLengthDistribute.ContainsKey(length))
                {
                    this.tweetsLengthDistribute.Add(length, new List<Tweet>()); 
                }
                this.tweetsLengthDistribute[length].Add(tweet);

                Object obj = new Object();
                int lenj = ManyLens.SignalR.ManyLensHub.cities1000.Count;
                double minDist = double.MaxValue;
                string countryName = "";
                Parallel.For(0, lenj, (j) => {
                    ManyLens.IO.TweetsIO.CityStruct city = ManyLens.SignalR.ManyLensHub.cities1000[j];
                    double dx = tweet.Lon - city.lon;
                    double dy = tweet.Lat - city.lat;
                    dx = dx * dx;
                    dy = dy * dy;
                    double dist = dx + dy;
                    lock (obj)
                    {
                        if (dist < minDist)
                        {
                            minDist = dist;
                            countryName = city.country;
                        }
                    }
                });
                tweet.CountryName = countryName;
                if (!this.tweetsLocationDistribute.ContainsKey(countryName))
                {
                    this.tweetsLocationDistribute.Add(countryName, new List<Tweet>());
                }
                this.tweetsLocationDistribute[countryName].Add(tweet);


                //Can not do this, we need to record the count of each word if we generated wordsOfTweetsAtSpecificLength here
                //if(!this.wordsOfTweetsAtSpecificLength.ContainsKey(length))
                //{
                //    this.wordsOfTweetsAtSpecificLength.Add(length,new HashSet<string>());
                //}
                //string[] words = tweet.ContentWords;
                //for(int j = 0, lenj = words.Length; j < lenj; ++j)
                //{
                //    this.wordsOfTweetsAtSpecificLength[length].Add(words[j]);
                //}
            }

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
                this.InitialLensData();
                for (int i = 0, len = newUnits.Count; i < len; ++i)
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
            for (int i = 0, len = exit.Count; i < len; ++i)
            {
                this.DetechUnit(exit[i]);
            }
            for (int i = 0, len = enter.Count; i < len; ++i)
            {
                this.MergeUnit(enter[i]);
            }

            //Re-initial some collection
            this.wordsOfTweetsAtSpecificLength = new Dictionary<int, HashSet<string>>();
            
        }

        public List<Tweet> GetTweetsAtLengthOf(int length)
        {
            return this.tweetsLengthDistribute[length];
        }

        public HashSet<String> GetWordsOfTweetsAtLengthOf(int length)
        {
            if (this.wordsOfTweetsAtSpecificLength.ContainsKey(length))
            {
                return this.wordsOfTweetsAtSpecificLength[length];
            }
            else
            {
                HashSet<string> words = new HashSet<string>();
                List<Tweet> tweets = this.GetTweetsAtLengthOf(length);
                for (int i = 0, len = tweets.Count; i < len; ++i)
                {
                    Tweet tweet = tweets[i];
                    string[] contentWords = tweet.ContentWords;
                    for (int j = 0, lenj = contentWords.Length; j < lenj; ++j)
                    {
                        words.Add(contentWords[j]);
                    }
                }
                this.wordsOfTweetsAtSpecificLength.Add(length, words);
                return words;
            }
        }

        public Dictionary<string,object> GetDataForVis(string baseData,string subData = null)
        {
            string[] t = new string[]{baseData,subData};


            Dictionary<string, object> data = new Dictionary<string, object>();
            for (int i = 0, len = t.Length; i < len; ++i)
            {
                switch (t[i])
                {
                    case "keywordsDistribute":
                        {
                            data.Add("keywordsDistribute", this.KeywordsDistribute);
                            break;
                        }
                    case "tweetLengthDistribute":
                        {
                            data.Add("tweetLengthDistribute", this.TweetLengthDistribute);
                            break;
                        }
                    case "hashTagDistribute":
                        {
                            data.Add("hashTagDistribute", this.HashTagDistribute);
                            break;
                        }
                    case "userTweetsDistribute":
                        {
                            data.Add("userTweetsDistribute", this.UserTweetsDistribute);
                            break;
                        }
                    case "retweetNetwork":
                        {
                            data.Add("retweetNetwork", this.RetweetNetwork);
                            break;
                        }
                    case "tweetsLocationDistribute":
                        { 
                            data.Add("tweetsLocationDistribute",this.TweetsLocationDistribute);
                            break;
                        }
                }
            }
            return data;
            //return new UnitsDataForLens()
            //{
            //    //unitsID = this.UnitsID,
            //    contents = this.TweetContents,
            //    keywordsDistribute = this.KeywordsDistribute,
            //    tweetLengthDistribute = this.TweetLengthDistribute,
            //    hashTagDistribute = this.HashTagDistribute,
            //    userTweetsDistribute = this.UserTweetsDistribute,
            //    retweetNetwork = this.RetweetNetwork
            //    //tweetIDs = unit.TweetIDs
            //};
        }
    }
}