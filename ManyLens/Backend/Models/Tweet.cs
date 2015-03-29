using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Linq;
using System.Web;
using System.Diagnostics;

namespace ManyLens.Models
{
    public class Tweet
    {
        private string tweetID = null;
        private string postUserName = null;
        private DateTime postDate;
        private int length = 0;
        private string originalContent = null;
        private string derivedContent = null;
        private List<string> hashTag = null;
        private double lon;
        private double lat;
        private string countryName = null; // will be add later 

        private User user;
        private string sourceUserName;

        #region Getter & Setter
        public string TweetID 
        { 
            get
            { 
                return this.tweetID;
            }
            private set 
            {
                this.tweetID = value;
            }
        }
        public string PostUserName 
        { 
            get
            {
                return this.postUserName;
            }
            private set 
            {
                this.postUserName = value;
            }
        }
        public string OriginalContent
        {
            get
            {
                return this.originalContent;
            }
            private set
            {
                this.originalContent = value;
            }
        }
        public string DerivedContent
        {
            get
            {
                return this.derivedContent;
            }
            set
            {
                this.derivedContent = value;
                this.length = this.derivedContent.Split(' ').Length;
            }
        }
        public string[] ContentWords
        {
            get
            {
                return this.derivedContent.Split(' ');
            }
        }
        public DateTime PostDate
        {
            get
            {
                return this.postDate;
            }
            private set 
            {
                this.postDate = value;
            }
        }
        public int Length
        {
            get
            {
                return this.length;
            }
        }
        public List<string> HashTag
        {
            get
            {
                return this.hashTag;
            }
        }
        
        public User User
        {
            get
            {
                return this.user;
            }

            private set
            {
                this.user = value;
            }
        }
        public string SourceUserName
        {
            get
            {
                return this.sourceUserName;
            }
        }
        public double Lat
        {
            get { return lat; }
            set { lat = value; }
        }
        public double Lon
        {
            get { return lon; }
            set { lon = value; }
        }
        public string CountryName
        {
            get { return countryName; }
            set { countryName = value; }
        }
        #endregion

        private Tweet(string tweetID, string originalContent,double lon, double lat, User user)
        {
            this.hashTag = new List<string>();
            this.TweetID = tweetID;
            this.OriginalContent = originalContent.Replace("\"", "\\\"");
            this.User = user;
            this.PostUserName = user.UserName;
            this.Lon = lon;
            this.Lat = lat;

            Regex RTreg = new Regex(@"^[Rr][Tt] ?@(\w+\b)");
            MatchCollection rts = RTreg.Matches(this.OriginalContent);
            if (rts.Count == 1)
            {
                this.sourceUserName = rts[0].Groups[1].Value;
            }
            else
            {
                this.sourceUserName = null;
            }
        }

        public Tweet(string tweetID, string originalContent)
        {
            this.TweetID = tweetID;
            this.OriginalContent = originalContent.Replace("\"", "\\\"");
        }

        public Tweet(string tweetID, string originalContent, string postDate, string lon, string lat, User user)
            : this(tweetID,originalContent,double.Parse(lon),double.Parse(lat),user)
        {
            TimeZoneInfo brTimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");
            
            
            this.PostDate = TimeZoneInfo.ConvertTimeFromUtc(DateTime.Parse(postDate).ToUniversalTime(),brTimeZone);
        }

        public Tweet(string tweetID, string originalContent, DateTime postDate,double lon,double lat, User user)
            : this(tweetID, originalContent,lon,lat,user)
        {
            this.PostDate = postDate;
        }

        public void AddHashTag(string hashTag)
        {
            if (hashTag.IndexOf("#") != 0)
                return;
            this.hashTag.Add(hashTag);
        }

    }
}