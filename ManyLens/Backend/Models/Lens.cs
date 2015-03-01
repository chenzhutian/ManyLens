using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{
    public class Lens
    {
        private String mapID;

        private List<Unit> units;   //always strore the real units in this lens
        private List<Unit> enter;  //store the new enter units
        private List<Unit> exit;     //store the exit units
        private Dictionary<object, bool> reBindFlag;

        private List<Tweet> tweets;
        private Dictionary<string, User> users;
        private Dictionary<string, int> usersCount; // the occurence time of each user

        private Dictionary<string, int> keywords;
        private Dictionary<string, int> hashTags;
        private Dictionary<int, HashSet<string>> keywordsGroupByTweetsLength;
        private Dictionary<int, List<Tweet>> tweetsGroupByLength;
        private Dictionary<string, List<Tweet>> tweetsGroupByLocation;

        private Network retweetNetwork;

        #region Getter&Setter
        public String MapID
        {
            get { return mapID; }
            set { mapID = value; }
        }
        public List<Tweet> Tweets
        {
            get 
            {

                if (this.reBindFlag[this.tweets])
                {
                    for (int i = 0, len = this.exit.Count; i < len; ++i)
                    { 
                        Unit unit = this.exit[i];
                        for (int j = 0, lenj = unit.TweetsCount; j < lenj; ++j)
                        {
                            this.tweets.Remove(unit.Tweets[j]);
                        }
                    }

                    for (int i = 0, len = this.enter.Count; i < len; ++i)
                    {
                        Unit unit = this.enter[i];
                        this.tweets.AddRange(unit.Tweets);
                    }

                    this.reBindFlag[this.tweets] = false;
                }
                return this.tweets;
            }
        }
        public int TweetsCount
        {
            get { return this.Tweets.Count; }
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
            get 
            {
                if(this.usersCount == null)
                    this.usersCount = new Dictionary<string,int>();

                if (this.reBindFlag[this.users])
                {
                    for (int i = 0, len = this.exit.Count; i < len; ++i)
                    {
                        Unit unit = this.exit[i];
                        foreach (KeyValuePair<string, User> item in unit.Users)
                        {
                            if (--this.usersCount[item.Key] == 0)
                            {
                                this.usersCount.Remove(item.Key);
                                this.users.Remove(item.Key);
                                //this.userTweets.Remove(item.Key);
                            }
                        }
                    }

                    for (int i = 0, len = this.enter.Count; i < len; ++i)
                    {
                        Unit unit = this.enter[i];
                        foreach (KeyValuePair<string, User> item in unit.Users)
                        {
                            if (this.users.ContainsKey(item.Key))
                            {
                                this.usersCount[item.Key]++;
                            }
                            else
                            {
                                this.users.Add(item.Key, item.Value);
                                this.usersCount.Add(item.Key, 1);
                            }
                        }
                    }
                    this.reBindFlag[this.users] = false;
                }
                return users; 
            }
        }

        public Dictionary<string, int> Keywords
        {
            get
            {
                if (this.reBindFlag[this.keywords])
                {
                    //Remove keyword size
                    for (int i = 0, len = this.exit.Count; i < len; ++i)
                    {
                        Unit unit = this.exit[i];
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

                    //Add the keyword size of each keyword to this lens
                    for (int i = 0, len = this.enter.Count; i < len; ++i)
                    {
                        Unit unit = this.enter[i];
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
                    this.reBindFlag[this.keywords] = false;
                }
                return this.keywords;
            }
        }
        public List<KeyValuePair<string, int>> KeywordsDistribute
        {
            get
            {
                return this.Keywords.ToList();
            }
        }
        public Dictionary<string, int> HashTags
        {
            get 
            {
                if (this.reBindFlag[this.hashTags])
                {
                    for (int i = 0, len = this.exit.Count; i < len; ++i)
                    {
                        Unit unit = this.exit[i];
                        for (int j = 0, lenj = unit.TweetsCount; j < lenj; ++i)
                        {
                            List<string> hts = unit.Tweets[j].HashTag;
                            foreach (string ht in hts)
                            {
                                if (--this.hashTags[ht] == 0)
                                {
                                    this.hashTags.Remove(ht);
                                }
                            }
                        }
                    }

                    for (int i = 0, len = this.enter.Count; i < len; ++i)
                    {
                        Unit unit = this.enter[i];
                        for (int j = 0, lenj = unit.TweetsCount; j < lenj; ++i)
                        {
                            List<string> hts = unit.Tweets[j].HashTag;
                            foreach (string ht in hts)
                            {
                                if (this.hashTags.ContainsKey(ht))
                                {
                                    this.hashTags[ht]++;
                                }
                                else
                                {
                                    this.hashTags.Add(ht, 1);
                                }
                            }
                        }
                    }
                    this.reBindFlag[this.hashTags] = false;
                }
                return this.hashTags; 
            }
        }
        public List<KeyValuePair<string, int>> HashTagDistribute
        {
            get
            {
                return this.HashTags.ToList();
            }
        }
        public Dictionary<int, List<Tweet>> TweetsGroupByLength
        {
            get
            {
                if (this.reBindFlag[this.tweetsGroupByLength])
                {
                    for (int i = 0, len = this.exit.Count; i < len; ++i)
                    {
                        Unit unit = this.exit[i];
                        for (int j = 0, lenj = unit.TweetsCount; j < lenj; ++j)
                        {
                            Tweet tweet = unit.Tweets[j];
                            int length = tweet.Length;
                            this.tweetsGroupByLength[length].Remove(tweet);
                            if (this.tweetsGroupByLength[length].Count == 0)
                            {
                                this.tweetsGroupByLength.Remove(length);
                            }
                        }
                    }

                    for (int i = 0, len = this.enter.Count; i < len; ++i)
                    {
                        Unit unit = this.enter[i];
                        for (int j = 0, lenj = unit.TweetsCount; j < lenj; ++j)
                        {
                            Tweet tweet = unit.Tweets[j];
                            int length = tweet.Length;
                            if (!this.tweetsGroupByLength.ContainsKey(length))
                            {
                                this.tweetsGroupByLength.Add(length, new List<Tweet>());
                            }
                            this.tweetsGroupByLength[length].Add(tweet);
                        }
                    }
                    this.reBindFlag[this.tweetsGroupByLength] = false;
                }
                return this.tweetsGroupByLength;
            }
        }
        public List<KeyValuePair<int, int>> TweetsLengthDistribute
        {
            get 
            {
                Dictionary<int, int> distribute = new Dictionary<int, int>();
                foreach(KeyValuePair<int,List<Tweet>> item in this.TweetsGroupByLength)
                {
                    distribute.Add(item.Key, item.Value.Count);
                }
                return distribute.ToList();
            }
        }
        public Dictionary<string, List<Tweet>> TweetsGroupByLocation
        {
            get
            {
                if (this.reBindFlag[this.tweetsGroupByLocation])
                {
                    for (int i = 0, len = this.exit.Count; i < len; ++i)
                    {
                        Unit unit = this.exit[i];
                        for (int j = 0, lenj = unit.TweetsCount; j < lenj; ++j)
                        {
                            Tweet tweet = unit.Tweets[j];
                            string countryName = tweet.CountryName;
                            if (countryName != null)
                            {
                                this.tweetsGroupByLocation[countryName].Remove(tweet);
                                if (this.tweetsGroupByLocation.Count == 0)
                                {
                                    this.tweetsGroupByLocation.Remove(countryName);
                                }
                            }
                        }
                    }

                    for (int i = 0, len = this.enter.Count; i < len; ++i)
                    {
                        Unit unit = this.enter[i];
                        for (int j = 0, lenj = unit.TweetsCount; j < lenj; ++j)
                        {
                            Tweet tweet = unit.Tweets[j];
                            Object obj = new Object();
                            double minDist = double.MaxValue;
                            string countryName = "";
                            Parallel.ForEach(ManyLens.SignalR.ManyLensHub.cities1000, (city)=>{
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
                            if (!this.tweetsGroupByLocation.ContainsKey(countryName))
                            {
                                this.tweetsGroupByLocation.Add(countryName, new List<Tweet>());
                            }
                            this.tweetsGroupByLocation[countryName].Add(tweet);
                        }
                    }
                }
                return this.tweetsGroupByLocation;
            }
        }
        public List<KeyValuePair<string, int>> TweetsLocationDistribute
        {
            get
            {
                Dictionary<string, int> distribute = new Dictionary<string, int>();
                foreach (KeyValuePair<string, List<Tweet>> item in this.TweetsGroupByLocation)
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
                if (this.reBindFlag[this.retweetNetwork])
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
                    this.retweetNetwork.links = links;
                    this.retweetNetwork.nodes = nodes ; 
                    this.reBindFlag[this.retweetNetwork] = false;
                }
                return this.retweetNetwork;
            }
        }
        #endregion

        private void InitialLens()
        {
            this.units = new List<Unit>();
            this.reBindFlag = new Dictionary<object, bool>();

            this.keywords = new Dictionary<string, int>();
            this.reBindFlag.Add(this.keywords, false);

            this.tweets = new List<Tweet>();
            this.reBindFlag.Add(this.tweets, false);

            this.hashTags = new Dictionary<string, int>();
            this.reBindFlag.Add(this.hashTags, false);

            this.users = new Dictionary<string,User>();
            this.usersCount = new Dictionary<string, int>();
            this.reBindFlag.Add(this.users, false);

            this.tweetsGroupByLength = new Dictionary<int, List<Tweet>>();
            this.reBindFlag.Add(this.tweetsGroupByLength, false);

            this.tweetsGroupByLocation = new Dictionary<string,List<Tweet>>();
            this.reBindFlag.Add(this.tweetsGroupByLocation, false);

            this.retweetNetwork = new Network();
            this.reBindFlag.Add(this.retweetNetwork, false);

            //Data shown by Interactive
            this.keywordsGroupByTweetsLength = new Dictionary<int, HashSet<string>>(1);
        }

        public Lens()
        {
            this.InitialLens();
        }

        public void BindUnits(List<Unit> newUnits)
        {
            this.enter = new List<Unit>();
            this.exit = new List<Unit>();
            //get the exit unit
            for (int i = 0, len = this.units.Count; i < len; ++i)
            {
                if (!newUnits.Contains(this.units[i]))
                {
                    this.exit.Add(this.units[i]);
                    this.units.RemoveAt(i);
                }
            }

            //Get exnter unit
            for (int i = 0, len = newUnits.Count; i < len; ++i)
            {
                if (!this.units.Contains(newUnits[i]))
                {
                    this.enter.Add(newUnits[i]);
                    this.units.Add(newUnits[i]);
                }
            }

            //Data shown by lens
            List<object> keys = this.reBindFlag.Keys.ToList();
            foreach(object key in keys)
            {
                this.reBindFlag[key] = true;
            }

            //Data shown by interactivation
            this.keywordsGroupByTweetsLength = new Dictionary<int, HashSet<string>>();
        }

        public Dictionary<string, object> GetDataForVis(string baseData, string subData = null)
        {
            string[] t = new string[] { baseData, subData };

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
                            data.Add("tweetLengthDistribute", this.TweetsLengthDistribute);
                            break;
                        }
                    case "hashTagDistribute":
                        {
                            data.Add("hashTagsDistribute", this.HashTagDistribute);
                            break;
                        }
                    case "retweetNetwork":
                        {
                            data.Add("retweetNetwork", this.RetweetNetwork);
                            break;
                        }
                    case "tweetsLocationDistribute":
                        {
                            data.Add("tweetsLocationDistribute", this.TweetsLocationDistribute);
                            break;
                        }
                }
            }
            return data;
        }

        //
        public List<Tweet> GetTweetsAtLengthOf(int length)
        {
            return this.TweetsGroupByLength[length];
        }

        public HashSet<String> GetWordsOfTweetsAtLengthOf(int length)
        {
            if (this.keywordsGroupByTweetsLength.ContainsKey(length))
            {
                return this.keywordsGroupByTweetsLength[length];
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
                this.keywordsGroupByTweetsLength.Add(length, words);
                return words;
            }
        }

    }
}