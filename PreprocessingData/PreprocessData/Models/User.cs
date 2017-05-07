using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Models
{
    public class User
    {
        private string userName;
        private string userID;
        private string homePage;
        private int tweetsCount;
        private int following;
        private int follower;
        private bool isV;
        private double lon;
        private double lat;
        private double kloutScore;

        private Dictionary<string, Tweet> tweets;
        private bool spamUser = false;


        #region Getter & Setter
        public string UserName
        {
            get
            {
                return this.userName;
            }
            private set
            {
                this.userName = value;
            }
        }
        public string UserID
        {
            get
            {
                return this.userID;
            }
            private set
            {
                this.userID = value;
            }
        }
        public double KloutScore
        {
            get { return this.kloutScore; }
            private set { this.kloutScore = value; }
        }
        public string Homepage
        {
            get
            {
                return this.homePage;
            }
            private set
            {
                this.homePage = value;
            }
        }
        public int TweetsCount
        {
            get
            {
                return this.tweetsCount;
            }
            private set
            {
                this.tweetsCount = value;
            }
        }
        public int Following
        {
            get
            {
                return this.following;
            }
            private set
            {
                this.following = value;
            }
        }
        public int Follower
        {
            get
            {
                return this.follower;
            }
            private set
            {
                this.follower = value;
            }
        }
        public bool IsV
        {
            get
            {
                return this.isV;
            }
            private set
            {
                this.isV = value;
            }
        }
        public double Lon
        {
            get { return lon; }
            set { lon = value; }
        }
        public double Lat
        {
            get { return lat; }
            set { lat = value; }
        }
        public bool SpamUser
        {
            get { return spamUser; }
            set { spamUser = value; }
        }

        #endregion

        //0tweetId \t 1userName \t 2userId \t 3tweetContent \t 4tweetDate \t 5userHomepage \t 6tweetsCount \t 7following 
        //\t 8follower \9 13V \t 10gpsA \t 11gpsB
        public User(string userID, string userName, string tweetsCount, string following, string follower, string V, string gpsA, string gpsB, double kloutScore)
        {
            this.UserID = userID;
            this.KloutScore = kloutScore;
            this.UserName = userName;
            this.TweetsCount = int.Parse(tweetsCount);
            this.Following = int.Parse(following);
            this.Follower = int.Parse(follower);
            this.IsV = bool.Parse(V);
            this.Lon = double.Parse(gpsA);
            this.Lat = double.Parse(gpsB);

            this.tweets = new Dictionary<string, Tweet>();
        }

        public void AddTweet(Tweet tweet)
        {
            if (this.tweets.ContainsKey(tweet.TweetID)) return;
            this.tweets.Add(tweet.TweetID, tweet);
        }
    }
}