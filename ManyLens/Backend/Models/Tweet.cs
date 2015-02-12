using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{
    public class Tweet
    {
        
        private string tweetID = null;
        private string postUserID = null;
        private DateTime postDate;
        private int length = 0;
        private string originalContent = null;
        private string derivedContent = null;

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
        public string PostUserID 
        { 
            get
            {
                return this.postUserID;
            }
            private set 
            {
                this.postUserID = value;
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

        public string IntervalId { get; private set; }
        public virtual Interval Interval { get; private set; }
        public string UnitId { get; private set; }
        public virtual Unit Unit { get; private set; }
        [Required]
        public string TermId { get; private set; }
        public virtual Term Term { get; private set; }
        #endregion

        private Tweet() { }
        private Tweet(string tweetID, string originalContent)
        {
            this.TweetID = tweetID;
            this.OriginalContent = originalContent;
        }

        public Tweet(string tweetID, string originalContent, string postDate)
            : this(tweetID,originalContent)
        {
            this.PostDate = DateTime.Parse(postDate);
            
        }

        public Tweet(string tweetID, string originalContent, DateTime postDate)
            : this(tweetID, originalContent)
        {
            this.PostDate = postDate;
        }

        public Tweet(string tweetID, string postUserID, string postDate, string originalContent)
        {
            this.TweetID = tweetID;
            this.PostUserID = postUserID;
            this.PostDate = DateTime.Parse(postDate);
            this.OriginalContent = originalContent;
        }
    }
}