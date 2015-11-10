using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Diagnostics;

namespace ManyLens.Models
{
    public abstract class  TweetSet
    {

        private List<Tweet> tweets = null;

        #region Getter & Setter
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
   
 
        #endregion

        protected TweetSet()
        {
            this.Tweets = new List<Tweet>();
        }

        protected virtual void AddTweet(Tweet tweet)
        {
            this.Tweets.Add(tweet);
        }

        public virtual Tweet RemoveTweetAt(int index)
        {
            if (index < 0 || (index - 1) > this.TweetsCount)
                return null;
            Tweet t = this.Tweets[index];
            this.Tweets.RemoveAt(index);

            return t;
        }

        public string GetTweetContentAt(int index)
        {
            if (index < 0 || (index - 1) > this.TweetsCount)
                return null;

            return this.Tweets[index].OriginalContent;
        }

        public string GetTweetIDAt(int index) 
        {
            return this.Tweets[index].TweetID;
        }
    }
}