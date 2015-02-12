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
        #endregion

        private Tweet(string tweetID, string originalContent)
        {
            this.TweetID = tweetID;
            this.OriginalContent = originalContent.Replace("\"", "\\\"");
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
    }
}