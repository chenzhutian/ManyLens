using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ManyLens.Models
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
        private double[] location;

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
        public double[] Location
        {
            get
            {
                if (this.location.Length != 2)
                    throw new Exception("The coordination format of this user is not (x,y)");
                return this.location;
            }
            private set
            {
                if (value.Length != 2)
                    throw new Exception("The coordination format of this user is not (x,y)");
                this.location = value;
            }
        }
        #endregion

        //0tweetId \t 1userName \t 2userId \t 3tweetContent \t 4tweetDate \t 5userHomepage \t 6tweetsCount \t 7following 
        //\t 8follower \9 13V \t 10gpsA \t 11gpsB
        public User(string userID, string userName, string tweetsCount, string following, string follower, string V, string gpsA, string gpsB)
        {
            this.UserID = userID;
            this.UserName = userName;
            this.TweetsCount = int.Parse(tweetsCount);
            this.Following = int.Parse(following);
            this.Follower = int.Parse(follower);
            this.IsV = bool.Parse(V);
            this.Location = new double[2] { double.Parse(gpsA), double.Parse(gpsB) };

        }



    }
}