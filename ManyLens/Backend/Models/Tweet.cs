using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Linq;
using System.Web;

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
        #endregion

        private Tweet(string tweetID, string originalContent, User user)
        {
            this.hashTag = new List<string>();
            this.TweetID = tweetID;
            this.OriginalContent = originalContent.Replace("\"", "\\\"");
            this.User = user;
            this.PostUserName = user.UserName;

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

        public Tweet(string tweetID, string originalContent, string postDate, User user)
            : this(tweetID,originalContent, user)
        {
            this.PostDate = DateTime.Parse(postDate);
            
        }

        public Tweet(string tweetID, string originalContent, DateTime postDate, User user)
            : this(tweetID, originalContent, user)
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